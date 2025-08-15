import db from '@/lib/db'
import { appRouter } from "@/lib/trpc/app-router"
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

const handler = (req: Request) => 
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({
      db
    })
  })

export { handler as GET, handler as POST }

