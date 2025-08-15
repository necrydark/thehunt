"use client";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/trpc/client";
import { User } from "better-auth";
import { Award, Medal, Trophy } from "lucide-react";
import { Badge } from "../ui/badge";

type Props = {
  user: User & {
    totalPoints?: number;
  };
};

export default function LeaderboardHeader({ user }: Props) {
  const {
    data: progress,
    isLoading: progressLoading,
    error: progressError,
  } = api.user.getStats.useQuery(undefined, { enabled: !!user });
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
      <div className="min-h-screen w-full relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
        </div>
      </div>
    );
  }

  // Add error handling
  if (progressError || itemsError || rankError) {
    return (
      <div className="min-h-screen w-full relative">
        <div className="flex items-center justify-center min-h-[400px]">
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            Champion
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
            Runner-up
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
            Third Place
          </Badge>
        );
      default:
        return null;
    }
  };

  const totalItems = items?.length || 0;
  const obtainedItems = progress?.itemsObtained || 0;
  const progressPercentage =
    totalItems > 0 ? (obtainedItems / totalItems) * 100 : 0;
  return (
    <main className="container mx-auto px-4">
      <Card
        className="my-8 text-white border-white/10"
        style={{
          background: `linear-gradient(to right, oklch(0.9181 0.2323 126.72 / 0.2), oklch(0.9181 0.2323 126.72 / 0.1))`,
          borderColor: "oklch(0.9181 0.2323 126.72 / 0.3)",
        }}
      >
        {/* <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy
            className="h-5 w-5"
            style={{ color: "oklch(0.9181 0.2323 126.72)" }}
          />
          Your Ranking
        </CardTitle>
      </CardHeader> */}
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getRankIcon(rank as number)}
              </div>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-300">
                  {user.totalPoints} points • {obtainedItems} weapons •{" "}
                  {Math.round(progressPercentage)}% complete
                </p>
              </div>
            </div>
            {getRankBadge(rank as number)}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
