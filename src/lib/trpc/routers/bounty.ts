import { BountyClaimStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../server";

export const bountyRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        status: z
          .enum([
            "PENDING",
            "OPEN",
            "CLAIMED",
            "COMPLETED",
            "CANCELLED",
            "EXPIRED",
          ])
          .optional(),
        limit: z.number().default(50).optional(),
        offset: z.number().default(0),
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
          issuer: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        skip: input.offset,
      });
    }),

  getAllClaims: publicProcedure
    .input(
      z.object({
        status: z
          .enum([
            "PENDING",
            "OPEN",
            "CLAIMED",
            "COMPLETED",
            "CANCELLED",
            "EXPIRED",
          ])
          .optional(),
        limit: z.number().default(50).optional(),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.bountyClaim.findMany({
        where: {
          ...(input.status && {
            status: input.status as BountyClaimStatus,
          }),
        },
        include: {
          claimer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          bounty: true,
        },
        orderBy: {
          claimedAt: "desc",
        },
        take: input.limit,
        skip: input.offset,
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        price: z.number(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Create the new bounty
      return await ctx.db.bounty.create({
        data: {
          title: input.title,
          price: input.price,
          description: input.description,
          issuedBy: ctx.user.id,
          status: "PENDING",
        },
        include: {
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

  //Review the bounties submitted.
  reviewBounty: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["OPEN", "CANCELLED"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.$transaction(async (tx) => {
        const bounty = await tx.bounty.update({
          where: { id: input.id },
          data: {
            status: input.status,
            updatedAt: new Date(),
          },
          include: {
            issuer: true,
          },
        });
        return bounty;
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
          message:
            "This bounty is no longer available or is not accepting submissions.",
        });
      }

      if (bounty.issuedBy === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot claim your own bounty",
        });
      }

      const existingClaims = await ctx.db.bountyClaim.findMany({
        where: {
          bountyId: input.bountyId,
          claimedBy: ctx.user.id,
        },
      });

      const approvedClaim = existingClaims.find(
        (claim) => claim.status === "ACCEPTED"
      );
      if (approvedClaim) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have this item.",
        });
      }

      const pendingClaim = existingClaims.find(
        (claim) => claim.status === "PENDING"
      );
      if (pendingClaim) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have a pending claim for this bounty.",
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
            status: "PENDING",
          },
          include: {
            bounty: {
              include: {
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
    }),

  // Accept/Reject bounty claims (for admins)
  reviewClaim: adminProcedure
    .input(
      z.object({
        claimId: z.string(),
        status: z.enum(["ACCEPTED", "REJECTED"]),
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
          message: "You can't only manage your own bounty claims",
        });
      }

      if (claim.status !== "PENDING") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This claim has already been processed",
        });
      }

      return await ctx.db.$transaction(async (tx) => {
        if (input.status === "ACCEPTED") {
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

  getTotalPrizes: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.bounty.aggregate({
      _sum: {
        price: true,
      },
    });

    return result._sum.price || 0;
  }),

  getUserClaimsByUsername: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().default(10), // Smaller default for public view
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!input.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found or User ID not valid.",
        });
      }

      return await ctx.db.bountyClaim.findMany({
        where: {
          claimedBy: input.userId,
        },
        include: {
          bounty: true,
        },
        orderBy: { claimedAt: "desc" },
        take: input.limit,
        skip: input.offset,
      });
    }),
});
