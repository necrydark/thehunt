import * as z from "zod";
import { adminProcedure, router } from "../server";

export const adminRouter = router({
  getAllStats: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany();
    const items = await ctx.db.item.findMany();
    const userCount = await ctx.db.user.count();
    const reviews = await ctx.db.submission.findMany();
    const totalPointsAggregate = await ctx.db.user.aggregate({
      _sum: {
        totalPoints: true,
      },
    });
    const weaponCount = await ctx.db.item.count();
    return {
      userCount,
      reviews,
      totalPointsAggregate,
      weaponCount,
      users,
      items,
    };
  }),

  getAllUsers: adminProcedure
    .input(
      z.object({
        name: z.string(),
        limit: z.number().default(50).optional(),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.user.findMany({
        where: {
          name: { contains: input.name, mode: "insensitive" as const },
        },
        orderBy: {
          name: "desc",
        },
        include: {
          submissions: true,
          userItems: true,
          _count: {
            select: {
              userItems: true,
            },
          },
        },
        take: input.limit,
        skip: input.offset,
      });
    }),

  banUser: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        banReason: z.string().optional(),
        banExpiresIn: z.coerce.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          banned: true,
          banExpire: input.banExpiresIn,
          banReason: input.banReason,
        },
      });
    }),

  unbanUser: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          banned: false,
          banReason: "",
          banExpire: null,
        },
      });
    }),
});
