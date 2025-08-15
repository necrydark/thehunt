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
        | "approved"
        | "pending"
        | "rejected"
        | "Not Submitted" = "Not Submitted";

      if (hasObtained) {
        userItemStatus = "approved";
      } else if (latestSubmission) {
        if (latestSubmission.status === "PENDING") {
          userItemStatus = "pending";
        } else if (latestSubmission.status === "REJECTED") {
          userItemStatus = "rejected";
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
