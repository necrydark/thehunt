"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { useState } from "react"
import { api } from "../trpc/client"
// import { authClient } from "../auth-client"

export function TRPCProvider({ children }:  { children: React.ReactNode}){

  // const { data: session} = authClient.useSession()
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000
      },
    },
  }))

  const [trpcClient] = useState(() => 
  api.createClient({
    links: [
      httpBatchLink({
        url: "/api/trpc",
        headers: () => {
          return {}
        },
      }),
    ],
  }))

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </api.Provider>
  )
}