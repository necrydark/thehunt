/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";
import { observable } from "@trpc/server/observable";
import * as z from "zod";
import { publicProcedure, router } from "../server";

type LeaderboardUpdate = {
  type: "update" | "insert" | "delete";
  user: {
    id: string;
    name: string;
    totalPoints: number;
    image?: string;
  } | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const leaderboardRouter = router({
  getTopUsers: publicProcedure
    .input(
      z.object({ limit: z.number().default(0), offset: z.number().default(0) })
    )
    .query(async ({ input, ctx }) => {
      const users = await ctx.db.user.findMany({
        take: input.limit,
        skip: input.offset,
        orderBy: { totalPoints: "desc" },
        select: {
          id: true,
          name: true,
          totalPoints: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              userItems: true,
            },
          },
        },
        where: {
          totalPoints: {
            gte: 0,
          },
        },
      });

      return users.map((user, idx) => ({
        ...user,
        rank: input.offset + idx + 1,
      }));
    }),

  getUserRank: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: { totalPoints: true },
      });

      if (!user) {
        return null;
      }

      const rank = await ctx.db.user.count({
        where: {
          totalPoints: {
            gt: user.totalPoints as number,
          },
        },
      });

      return rank + 1;
    }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const totalUsers = await ctx.db.user.count({
      where: {
        totalPoints: {
          gt: 0,
        },
      },
    });

    const totalSubmissions = await ctx.db.submission.count();
    const approvedSubmissions = await ctx.db.submission.count({
      where: { status: "APPROVED" },
    });

    const totalItems = await ctx.db.item.count();

    const totalPointsAggregate = await ctx.db.user.aggregate({
      _sum: {
        totalPoints: true,
      },
    });

    return {
      totalUsers,
      totalSubmissions,
      approvedSubmissions,
      totalItems,
      totalPoints: totalPointsAggregate._sum.totalPoints || 0,
    };
  }),

  onLeaderboardUpdate: publicProcedure.subscription(() => {
    return observable<LeaderboardUpdate>((emit) => {
      const subscription = supabase
        .channel("leaderboard")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "user",
          },
          (payload: any) => {
            emit.next({
              type: payload.eventType as "update" | "insert" | "delete",
              user: payload.new
                ? {
                    id: payload.new.id,
                    name: payload.new.name,
                    totalPoints: payload.new.totalPoints,
                    image: payload.new.image,
                  }
                : null,
            });
          }
        )
        .subscribe();

      return () => subscription.unsubscribe();
    });
  }),
});
