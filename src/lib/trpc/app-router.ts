import { itemRouter } from './routers/item'
import { leaderboardRouter } from './routers/leaderboard'
import { submissionRouter } from './routers/submission'
import { userRouter } from './routers/user'
import { router } from './server'

export const appRouter = router({
  leaderboard: leaderboardRouter,
  user: userRouter,
  item: itemRouter,
  submission: submissionRouter,
})

export type AppRouter = typeof appRouter