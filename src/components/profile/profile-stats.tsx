"use client";
import { api } from "@/lib/trpc/client";
import { User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
type Props = {
  user: User & {
    role?: string;
    totalPoints?: number;
  };
};

export default function ProfileStats({ user }: Props) {
  const {
    data: progress,
    isLoading: progressLoading,
    error: progressError,
  } = api.user.getPublicStats.useQuery({
    username: user.name,
  });
  const {
    data: items,
    isLoading: itemsLoading,
    error: itemsError,
  } = api.item.getAll.useQuery({ limit: 400 });

  const {
    data: rank,
    isLoading: rankLoading,
    error: rankError,
  } = api.leaderboard.getUserRank.useQuery({
    userId: user.id as string,
  });

  if (progressLoading || itemsLoading || rankLoading) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center ">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
        </div>
      </div>
    );
  }

  // Add error handling
  if (progressError || itemsError || rankError) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center">
          <div className="text-red-500">
            Error loading data:{" "}
            {progressError?.message ||
              itemsError?.message ||
              rankError?.message}
          </div>
        </div>
      </div>
    );
  }

  const totalItems = items?.length || 0;
  const obtainedItems = progress?.itemsObtained || 0;
  const progressPercentage =
    totalItems > 0 ? (obtainedItems / totalItems) * 100 : 0;
  return (
    <Card className="bg-black/20 border-white/10 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 grid-cols-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-400">
              {progress?.totalPoints}
            </div>
            <div className="text-sm text-gray-400">Total Points</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-400">
              {obtainedItems}
            </div>
            <div className="text-sm text-gray-400">Weapons Collected</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-red-400">{rank}</div>
            <div className="text-sm text-gray-400">Rank</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round(progressPercentage)}%
            </div>
            <div className="text-sm text-gray-400">Complete</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
