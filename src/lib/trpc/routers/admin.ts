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
});
