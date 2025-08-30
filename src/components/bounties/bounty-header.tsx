"use client";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/trpc/client";
import { Banknote, Medal, Trophy } from "lucide-react";

// Bounty Stats
// TODO: Create Header with stats (open bounties, claimed, total prize pool) cards
export default function BountiesHeader() {
  const {
    data: bounties,
    isLoading: bountiesLoading,
    error: bountiesError,
  } = api.bounty.getAll.useQuery({});

  const {
    data: prizes,
    isLoading: prizesLoading,
    error: prizesError,
  } = api.bounty.getTotalPrizes.useQuery();

  if (bountiesLoading || prizesLoading) {
    return (
      <div className="min-h-screen w-full relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
        </div>
      </div>
    );
  }

  // Add error handling
  if (bountiesError || prizesError) {
    return (
      <div className="min-h-screen w-full relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500">
            Error loading data: {bountiesError?.message || prizesError?.message}
          </div>
        </div>
      </div>
    );
  }

  const activeBounties = bounties?.filter((b) => b.status === "OPEN");
  const claimedBounties = bounties?.filter((b) => b.status === "CLAIMED");
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-black/20 border-white/10 text-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Active Bounties</p>
              <p className="text-2xl font-bold">{activeBounties?.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-black/20 border-white/10 text-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Medal className="h-8 w-8 text-orange-400" />
            <div>
              <p className="text-sm text-gray-400">Claimed Bounties</p>
              <p className="text-2xl font-bold">
                {claimedBounties?.length ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-black/20 border-white/10 text-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Banknote className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Total Prize Money</p>
              <p className="text-2xl font-bold">${prizes}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
