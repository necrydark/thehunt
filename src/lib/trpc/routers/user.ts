import { TRPCError } from "@trpc/server"
import * as z from "zod"
import { protectedProcedure, publicProcedure, router } from "../server"


export const userRouter = router({
  getProfile: protectedProcedure
  .query(async ({ctx}) => {
    const user = await ctx.db.user.findUnique({
      where: {id: ctx.user.id},
      include: {
        userItems: {
          include: {
            item: true
          }
        },
        submissions: {
          include: {
            item:true
          },
          orderBy:{submittedAt: "desc"},
          take: 10
        },
      }
    })
    if(!user){
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found"})
    }

    return user
  }),

  getByUsername: publicProcedure
  .input(z.object({
    name: z.string()
  }))
  .query(async ({ input, ctx}) => {
    const user = await ctx.db.user.findUnique({
      where: { name: input.name},
      select: {
        id: true,
        name: true,
        image: true,
        totalPoints: true,
        createdAt: true,
        userItems: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                points: true,
                imageUrl: true,
                rarity: true
              }
            }
          }
        },
        submissions: {
          where: { status: 'APPROVED' },
          include: {
            item: {
              select: {
                name: true,
                points: true,
                imageUrl: true
              }
            }
          },
          orderBy: { submittedAt: 'desc' },
          take: 20
        }
      }
    })

    if(!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found."})
    }

    return user
  }),

  getObtainedItems: protectedProcedure
  .query(async ({ ctx }) => {
    return await ctx.db.userItem.findMany({
      where: {userId: ctx.user.id},
      include: {
        item: true
      },
      orderBy: {obtainedAt: 'desc'}
    })
  }),

  getStats: protectedProcedure
  .query(async ({ ctx }) => {
    console.log("Called")
    const stats = await ctx.db.user.findUnique({
      where: {id: ctx.user.id},
      include: {
        _count: {
          select: {
            submissions: true,
            userItems: true
          }
        },
        submissions: {
          select: {status: true}
        }
      }
    })

    if(!stats) {
      throw new TRPCError({ code: "NOT_FOUND"})
    }

    const approvedSubmissions = stats.submissions.filter(sub => sub.status === "APPROVED").length
    const pendingSubmissions = stats.submissions.filter(sub => sub.status === "PENDING").length
    const rejectedSubmissions = stats.submissions.filter(sub => sub.status === "REJECTED").length

    return {
      totalPoints: stats.totalPoints || 0,
      totalSubmissions: stats._count.submissions,
      itemsObtained: stats._count.userItems,
      approvedSubmissions,
      pendingSubmissions,
      rejectedSubmissions
    }
  }),
})