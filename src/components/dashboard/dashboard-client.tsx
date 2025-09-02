"use client";

import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/trpc/client";
import { Award, Scroll, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";

export default function DashboardClient() {
  const { data: session } = authClient.useSession();
  const {
    data: progress,
    isLoading: progressLoading,
    error: progressError,
  } = api.user.getStats.useQuery(undefined, { enabled: !!session?.user });
  const {
    data: items,
    isLoading: itemsLoading,
    error: itemsError,
  } = api.item.getAll.useQuery({ limit: 400 });

  // Correct usage: pass an object with userId property
  const {
    data: rank,
    isLoading: rankLoading,
    error: rankError,
  } = api.leaderboard.getUserRank.useQuery({
    userId: session?.user.id as string,
  });

  const {
    data: topRank,
    isLoading: topRankLoading,
    error: topRankError,
  } = api.leaderboard.getTopUsers.useQuery({ limit: 1 });

  const {
    data: bounties,
    isLoading: bountiesLoading,
    error: bountiesError,
  } = api.bounty.getAll.useQuery({});

  // Add error logging to help debug
  if (progressError) {
    console.error("Progress error:", progressError);
  }
  if (itemsError) {
    console.error("Items error:", itemsError);
  }

  if (
    progressLoading ||
    itemsLoading ||
    rankLoading ||
    topRankLoading ||
    bountiesLoading
  ) {
    return (
      <div className="min-h-screen w-full relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
        </div>
      </div>
    );
  }

  // Add error handling
  if (
    progressError ||
    itemsError ||
    rankError ||
    topRankError ||
    bountiesError
  ) {
    return (
      <div className="min-h-screen w-full relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500">
            Error loading data:{" "}
            {progressError?.message ||
              itemsError?.message ||
              rankError?.message ||
              topRankError?.message ||
              bountiesError?.message}
          </div>
        </div>
      </div>
    );
  }

  // Calculate progress percentage safely
  const totalItems = items?.length || 0;
  const obtainedItems = progress?.itemsObtained || 0;
  const progressPercentage =
    totalItems > 0 ? (obtainedItems / totalItems) * 100 : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-8">
      <Card className="bg-black/20 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scroll className="h-5 w-5 text-red-400" />
            Checklist
          </CardTitle>
          <CardDescription>
            Track your weapon collection progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {obtainedItems} / {totalItems}
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-3 bg-black [&>div]:bg-primary-green"
            />
          </div>
          <Link href={"/dashboard/checklist"}>
            <Button className="w-full mt-4  cursor-pointer bg-green-500 hover:bg-green-600 text-black">
              View Checklist
            </Button>
          </Link>
        </CardContent>
      </Card>
      <Card className="bg-black/20 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-400" />
            Leaderboard
          </CardTitle>
          <CardDescription>View your rank on the leaderboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Your Rank</span>
              <span>{rank}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Top Hunter</span>
              <span>{topRank?.[0].name}</span>
            </div>
          </div>
          <Link href={`/leaderboard`}>
            <Button className="w-full mt-4  cursor-pointer bg-green-500 hover:bg-green-600 text-black">
              View Leaderboard
            </Button>
          </Link>
        </CardContent>
      </Card>
      <Card className="bg-black/20 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            Profile & Stats
          </CardTitle>
          <CardDescription>View your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Points</span>
              <span>{progress?.totalPoints}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-auto w-full">
          <Button
            asChild
            className="w-full mt-4 cursor-pointer bg-green-500 hover:bg-green-600 text-black"
          >
            <Link href={`/profile/${session?.user.name}`}>View Profile</Link>
          </Button>
        </CardFooter>
      </Card>
      <Card className="bg-black/20 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Bounties
          </CardTitle>
          <CardDescription>
            View the available bounties to collect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Bounties Available</span>
              <span>{bounties?.length}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-auto w-full">
          <Button
            asChild
            className="w-full mt-4 cursor-pointer bg-green-500 hover:bg-green-600 text-black"
          >
            <Link href={`/dashboard/bounties`}>View Bounties</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
