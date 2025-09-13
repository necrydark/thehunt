import { TRPCError } from "@trpc/server";
import * as z from "zod";
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../server";

export const itemRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        rarity: z.number().optional(),
        search: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const where = {
        ...(input.category && { type: input.category }),
        ...(input.rarity && { rarity: input.rarity }),
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: "insensitive" as const } },
            {
              manufacturer: {
                contains: input.search,
                mode: "insensitive" as const,
              },
            },
          ],
        }),
      };

      return await ctx.db.item.findMany({
        where,
        take: input.limit,
        skip: input.offset,
        orderBy: [{ rarity: "desc" }, { points: "asc" }, { name: "asc" }],
        include: {
          userItems: ctx.user
            ? {
                where: { userId: ctx.user.id },
              }
            : false,
        },
      });
    }),

  getUserProgress: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.item.findMany({
      include: {
        userItems: {
          where: { userId: ctx.user.id },
        },
        submissions: {
          where: { userId: ctx.user.id },
          orderBy: { submittedAt: "desc" },
          take: 1,
        },
      },
      orderBy: [{ rarity: "desc" }, { points: "desc" }],
    });

    return items.map((item) => {
      const hasObtained = item.userItems.length > 0;
      const latestSubmission = item.submissions[0] || null;

      // Determine the item's progress status for the user
      let userItemStatus:
        | "Approved"
        | "Pending"
        | "Rejected"
        | "Not Submitted" = "Not Submitted";

      if (hasObtained) {
        userItemStatus = "Approved";
      } else if (latestSubmission) {
        if (latestSubmission.status === "PENDING") {
          userItemStatus = "Pending";
        } else if (latestSubmission.status === "REJECTED") {
          userItemStatus = "Rejected";
        }
      }

      return {
        ...item,
        isObtained: hasObtained, // Legacy for existing checks
        latestSubmission: latestSubmission, // Full latest submission object
        userItemStatus: userItemStatus, // New computed status
        // You might also want to include the rejectionReason if applicable:
        rejectionReason:
          latestSubmission?.status === "REJECTED"
            ? latestSubmission.rejectionReason
            : null,
      };
    });
  }),

  getUserProgressByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { name: input.username },
        select: { id: true },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const items = await ctx.db.item.findMany({
        include: {
          userItems: {
            where: { userId: user.id },
          },
          submissions: {
            where: {
              userId: user.id,
              status: "APPROVED", // Only show approved submissions for public view
            },
            orderBy: { submittedAt: "desc" },
            take: 1,
          },
        },
        orderBy: [{ rarity: "desc" }, { points: "desc" }],
      });

      return items.map((item) => {
        const hasObtained = item.userItems.length > 0;
        const latestApprovedSubmission = item.submissions[0] || null;

        // For public view, only show approved or not obtained
        let userItemStatus: "approved" | "Not Submitted" = "Not Submitted";

        if (hasObtained) {
          userItemStatus = "approved";
        }

        return {
          ...item,
          isObtained: hasObtained,
          latestSubmission: latestApprovedSubmission, // Only approved submissions
          userItemStatus: userItemStatus,
          // Don't expose rejection reasons publicly
          rejectionReason: null,
        };
      });
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.item.findUnique({
        where: { id: input.id },
        include: {
          submissions: {
            where: { status: "APPROVED" },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: { submittedAt: "desc" },
            take: 10,
          },
          userItems: ctx.user
            ? {
                where: { userId: ctx.user.id },
              }
            : false,
        },
      });
    }),

  getItemStats: publicProcedure.query(async ({ ctx }) => {
    const [totalItems, totalPoints, pointsByRarity] = await Promise.all([
      ctx.db.item.count(),

      ctx.db.item.aggregate({
        _sum: {
          points: true,
        },
      }),

      ctx.db.item.groupBy({
        by: ["rarity"],
        _sum: {
          points: true,
        },
        _count: {
          _all: true,
        },
        orderBy: {
          rarity: "desc",
        },
      }),
    ]);

    return {
      totalItems,
      totalPoints: totalPoints._sum.points || 0,
      averagePoints:
        totalItems > 0
          ? Math.round((totalPoints._sum.points || 0) / totalItems)
          : 0,
      pointsByRarity: pointsByRarity.map((item) => ({
        rarity: item.rarity,
        count: item._count._all,
        totalPoints: item._sum.points || 0,
        averagePoints:
          item._count._all > 0
            ? Math.round((item._sum.points || 0) / item._count._all)
            : 0,
      })),
    };
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        points: z.number().min(1),
        mayhem: z.string(),
        listGroup: z.string(),
        type: z.string(),
        manufacturer: z.string().optional(),
        source: z.string(),
        maps: z.string(),
        missionType: z.string(),
        rarity: z.number().min(1).max(5),
        notes: z.string().optional(),
        imageUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.item.create({
        data: input,
      });
    }),

  createMany: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        points: z.number().min(1),
        mayhem: z.string(),
        listGroup: z.string(),
        type: z.string(),
        manufacturer: z.string().optional(),
        source: z.string(),
        maps: z.string(),
        missionType: z.string(),
        rarity: z.number().min(1).max(5),
        notes: z.string().optional(),
        imageUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.item.createMany({
        data: input,
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        points: z.number().min(1),
        mayhem: z.string(),
        listGroup: z.string(),
        type: z.string(),
        manufacturer: z.string().optional(),
        source: z.string(),
        maps: z.string(),
        missionType: z.string(),
        rarity: z.number().min(1).max(5),
        notes: z.string().optional(),
        imageUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return await ctx.db.item.update({
        where: { id },
        data,
      });
    }),

  delete: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.item.delete({
        where: { id: input.id },
      });
    }),
});
