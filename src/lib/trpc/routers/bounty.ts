import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { protectedProcedure, publicProcedure, router } from "../server";

export const bountyRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const where = input.search
        ? {
            OR: [
              {
                title: { contains: input.search, mode: "insensitive" as const },
              },
              {
                name: { contains: input.search, mode: "insensitive" as const },
              },
            ],
          }
        : {};

      return await ctx.db.bounty.findMany({
        where,
        include: {
          item: true,
          issuer: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        price: z.number(),
        description: z.string().optional(),
        itemId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if a bounty already exists for the given itemId
      const existingBounty = await ctx.db.bounty.findFirst({
        where: { itemId: input.itemId },
      });

      if (existingBounty) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A bounty already exists for this item.",
        });
      }

      const item = await ctx.db.item.findUnique({
        where: { id: input.itemId },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }

      // Create the new bounty
      return await ctx.db.bounty.create({
        data: {
          title: input.title,
          price: input.price,
          description: input.description,
          itemId: input.itemId,
          issuedBy: ctx.user.id,
          status: "OPEN",
        },
        include: {
          item: true,
          issuer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const bounty = await ctx.db.bounty.findUnique({
        where: { id: input.id },
        select: {
          issuer: true,
        },
      });

      if (bounty?.issuer.id !== input.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this bounty.",
        });
      }

      return await ctx.db.bounty.delete({
        where: { id: input.id },
      });
    }),

  //getById: public
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const bounty = await ctx.db.bounty.findUnique({
        where: { id: input.id },
        select: {
          claims: true,
          createdAt: true,
          description: true,
          id: true,
          issuedBy: true,
          issuer: true,
          item: true,
          price: true,
          status: true,
          title: true,
          updatedAt: true,
        },
      });

      if (!bounty) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Bounty not found" });
      }

      return bounty;
    }),

  //claim: protected
  claim: protectedProcedure
    .input(
      z.object({
        bountyId: z.string(),
        twitchClipUrl: z.string().url(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const bounty = await ctx.db.bounty.findUnique({
        where: { id: input.bountyId },
        include: { item: true },
      });

      if (!bounty) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bounty not found",
        });
      }

      if (bounty.status !== "OPEN") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This bounty is no longer available",
        });
      }

      // Prevent users from claiming their own bounties
      if (bounty.issuedBy === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot claim your own bounty",
        });
      }

      const existingBountyClaim = await ctx.db.bountyClaim.findUnique({
        where: {
          bountyId_claimedBy: {
            claimedBy: ctx.user.id,
            bountyId: input.bountyId,
          },
        },
      });

      if (existingBountyClaim) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have a pending claim for this item.",
        });
      }

      return await ctx.db.$transaction(async (tx) => {
        await tx.bounty.update({
          where: { id: input.bountyId },
          data: { status: "CLAIMED" },
        });

        return await tx.bountyClaim.create({
          data: {
            clipUrl: input.twitchClipUrl,
            bountyId: input.bountyId,
            message: input.message,
            claimedBy: ctx.user.id,
          },
          include: {
            bounty: {
              include: {
                item: true,
                issuer: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
            claimer: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });
      });

      // return await ctx.db.bountyClaim.create({
      //   data: {
      //     clipUrl: input.twitchClipUrl,
      //     bountyId: input.bountyId,
      //     message: input.message,
      //     claimedBy: ctx.user.id,
      //   },
      //   include: {
      //     bounty: true,
      //     claimer: {
      //       select: {
      //         id: true,
      //         name: true,
      //         image: true,
      //       },
      //     },
      //   },
      // });
    }),

  // Accept/Reject bounty claims (for bounty issuer)
  updateClaim: protectedProcedure
    .input(
      z.object({
        claimId: z.string(),
        action: z.enum(["ACCEPT", "REJECT"]),
        feedback: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const claim = await ctx.db.bountyClaim.findUnique({
        where: { id: input.claimId },
        include: {
          bounty: {
            include: { issuer: true },
          },
        },
      });

      if (!claim) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Claim not found",
        });
      }

      // Only bounty issuer can accept/reject
      if (claim.bounty.issuedBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only manage your own bounty claims",
        });
      }

      if (claim.status !== "PENDING") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This claim has already been processed",
        });
      }

      return await ctx.db.$transaction(async (tx) => {
        if (input.action === "ACCEPT") {
          // Update bounty status to completed
          await tx.bounty.update({
            where: { id: claim.bountyId },
            data: { status: "COMPLETED" },
          });

          // Update claim status to accepted
          await tx.bountyClaim.update({
            where: { id: input.claimId },
            data: {
              status: "ACCEPTED",
              updatedAt: new Date(),
            },
          });
        } else {
          // Return points to issuer (since they were locked when bounty was created)

          // Reopen bounty for other users to claim
          await tx.bounty.update({
            where: { id: claim.bountyId },
            data: { status: "OPEN" },
          });

          // Update claim status to rejected
          await tx.bountyClaim.update({
            where: { id: input.claimId },
            data: {
              status: "REJECTED",
              updatedAt: new Date(),
            },
          });
        }

        // Return updated claim with related data
        return await tx.bountyClaim.findUnique({
          where: { id: input.claimId },
          include: {
            bounty: {
              include: {
                item: true,
                issuer: {
                  select: { id: true, name: true, image: true },
                },
              },
            },
            claimer: {
              select: { id: true, name: true, image: true },
            },
          },
        });
      });
    }),
});
