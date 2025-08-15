import { initTRPC, TRPCError } from '@trpc/server'
import { headers } from 'next/headers'
import { auth } from '../auth'
import db from '../db'

const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure.use(async ({ next, ctx}) => {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  return next({
    ctx: {
      ...ctx,
      db,
      user: session?.user
    }
  })
})

export const protectedProcedure = t.procedure.use(async ({ next, ctx}) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED"})
  }
  return next({
    ctx: {
      ...ctx,
      user: session?.user,
      db
    }
  })
})

export const adminProcedure = protectedProcedure.use(async ({next, ctx }) => {
  const user = await ctx.db.user.findUnique({
    where: {id: ctx.user.id},
    select: {role:true}
  })

  if(user?.role !== "Admin"){
    throw new TRPCError({ code: "FORBIDDEN"})
  }

  return next({ ctx })
})