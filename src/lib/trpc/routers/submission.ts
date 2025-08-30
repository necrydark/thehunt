import { TRPCError } from "@trpc/server";
import * as z from "zod";
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../server";

export const submissionRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        twitchClipUrl: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingUserItem = await ctx.db.userItem.findUnique({
        where: {
          userId_itemId: {
            userId: ctx.user.id,
            itemId: input.itemId,
          },
        },
      });

      if (existingUserItem) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have this item.",
        });
      }

      const pendingSubmission = await ctx.db.submission.findFirst({
        where: {
          userId: ctx.user.id,
          itemId: input.itemId,
          status: "PENDING",
        },
      });
      if (pendingSubmission) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have a pending submission for this item.",
        });
      }

      return await ctx.db.submission.create({
        data: {
          userId: ctx.user.id,
          itemId: input.itemId,
          twitchClipUrl: input.twitchClipUrl,
        },
        include: {
          item: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  getUserSubmissions: protectedProcedure
    .input(
      z.object({
        status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.submission.findMany({
        where: {
          userId: ctx.user.id,
          ...(input.status && { status: input.status }),
        },
        include: {
          item: true,
          adminReviewer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { submittedAt: "desc" },
        take: input.limit,
        skip: input.offset,
      });
    }),

  getUserSubmissionsByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
        limit: z.number().default(10), // Smaller default for public view
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      // First find the user by username
      const user = await ctx.db.user.findUnique({
        where: { name: input.username },
        select: { id: true },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      // Only return APPROVED submissions for public viewing
      return await ctx.db.submission.findMany({
        where: {
          userId: user.id,
          status: "APPROVED", // Only show approved submissions publicly
        },
        include: {
          item: {
            select: {
              id: true,
              name: true,
              points: true,
              imageUrl: true,
              rarity: true,
              type: true,
            },
          },
          // Don't include adminReviewer info for public view
        },
        orderBy: { submittedAt: "desc" },
        take: input.limit,
        skip: input.offset,
      });
    }),

  getAll: adminProcedure
    .input(
      z.object({
        status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
        limit: z.number().default(50).optional(),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.submission.findMany({
        where: {
          ...(input.status && { status: input.status }),
        },
        include: {
          item: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          adminReviewer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          submittedAt: "desc",
        },
        take: input.limit,
        skip: input.offset,
      });
    }),

  review: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["APPROVED", "REJECTED"]),
        rejectionReason: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.$transaction(async (tx) => {
        const submission = await tx.submission.update({
          where: { id: input.id },
          data: {
            status: input.status,
            reviewedBy: ctx.user.id,
            reviewedAt: new Date(),
            rejectionReason: input.rejectionReason,
          },
          include: {
            item: true,
            user: true,
          },
        });

        if (input.status === "APPROVED") {
          await tx.userItem.create({
            data: {
              userId: submission.userId,
              itemId: submission.itemId,
            },
          });

          await tx.user.update({
            where: { id: submission.userId },
            data: {
              totalPoints: {
                increment: submission.item.points,
              },
            },
          });
        }
        return submission;
      });
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const submission = await ctx.db.submission.findUnique({
        where: { id: input.id },
        include: {
          item: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          adminReviewer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!submission) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const user = await ctx.db.user.findUnique({
        where: { id: ctx.user.id },
        select: { role: true },
      });

      if (submission.userId !== ctx.user.id && user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return submission;
    }),
});
