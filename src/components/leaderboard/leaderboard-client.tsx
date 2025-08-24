/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/trpc/client";
import {
  Award,
  Crown,
  FileCheck,
  Medal,
  Package,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 20;

export default function LeaderboardPage() {
  // const { data: session } = authClient.useSession();
  const [page, setPage] = useState(0);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  // Fetch leaderboard data
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
    refetch,
  } = api.leaderboard.getTopUsers.useQuery({
    limit: ITEMS_PER_PAGE,
    offset: page * ITEMS_PER_PAGE,
  });

  // Fetch stats
  const { data: stats } = api.leaderboard.getStats.useQuery();

  // Subscribe to real-time updates (commented out until client is configured)
  // api.leaderboard.onLeaderboardUpdate.useSubscription(undefined, {
  //   onData: (update) => {
  //     console.log("Leaderboard update:", update);
  //     refetch();
  //   },
  //   enabled: true,
  // });

  // Auto-refresh every 30 seconds as fallback
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [refetch]);

  // Update users when data changes
  useEffect(() => {
    if (users) {
      setAllUsers(users);
    }
  }, [users]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <span className="h-6 w-6 flex items-center justify-center text-sm font-bold">
            #{rank}
          </span>
        );
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30";
      default:
        return "bg-black/20 border-white/10";
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

  if (usersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Failed to load leaderboard</p>
            <p className="text-sm text-gray-400 mt-2">{usersError.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pb-8">
      {/* Header */}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-black/20 border-white/10 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Active Hunters</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Submissions</p>
                  <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileCheck className="h-8 w-8 text-emerald-400" />
                <div>
                  <p className="text-sm text-gray-400">Approved</p>
                  <p className="text-2xl font-bold">
                    {stats.approvedSubmissions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Weapons</p>
                  <p className="text-2xl font-bold">{stats.totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top 3 Hunters */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {usersLoading ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 bg-white/10" />
                  <Skeleton className="h-3 w-24 bg-white/10" />
                </div>
                <Skeleton className="h-6 w-16 bg-white/10" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {allUsers.slice(0, 3).map((user, idx) => (
              <Card
                key={user.id}
                className={`text-white border-white/10 ${
                  idx === 0
                    ? "bg-gradient-to-b from-yellow-500/20 to-yellow-600/10 border-yellow-500/30"
                    : idx === 1
                    ? "bg-gradient-to-b from-gray-400/20 to-gray-500/10 border-gray-400/30"
                    : "bg-gradient-to-b from-amber-500/20 to-amber-600/10 border-amber-500/30"
                }`}
              >
                <CardHeader className="text-center !justify-items-center pb-2">
                  <div className="flex justify-center  mb-2">
                    {getRankIcon(user.rank)}
                  </div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  {getRankBadge(user.rank)}
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <div className="text-2xl font-bold text-white">
                    {user.totalPoints}
                  </div>
                  <div className="text-sm text-gray-300">points</div>
                  <div className="text-sm">
                    <span className="text-white font-medium">
                      {user.completedWeapons}
                    </span>
                    <span className="text-gray-300">
                      weapons ({user._count.userItems})
                    </span>
                  </div>
                  {user.platform && user.vaultHunter && (
                    <div className="flex justify-center flex-wrap gap-2">
                      <Badge className="bg-black border-primary-green/75 text-primary-green">
                        {user.platform}
                      </Badge>
                      <Badge className="bg-black border-primary-green/75 text-primary-green">
                        {user.vaultHunter}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Leaderboard */}
      <Card className="bg-black/20 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top Hunters
          </CardTitle>
          <CardDescription>
            Rankings based on total points earned from weapon submissions
          </CardDescription>
          <p className="text-muted-foreground text-xs">
            Leaderboard updates every 30 seconds.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {usersLoading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32 bg-white/10" />
                    <Skeleton className="h-3 w-24 bg-white/10" />
                  </div>
                  <Skeleton className="h-6 w-16 bg-white/10" />
                </div>
              ))}
            </div>
          ) : allUsers.length > 0 ? (
            <div className="space-y-2 p-6">
              {allUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex sm:flex-row flex-col sm:justify-normal justify-center items-center gap-4 p-4 rounded-lg border transition-all hover:bg-white/5 ${getRankStyle(
                    user.rank
                  )}`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-10">
                    {getRankIcon(user.rank)}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center sm:justify-normal sm:flex-row flex-col sm:mb-0 mb-2 justify-center gap-2">
                      <Link
                        href={`/profile/${user.name}`}
                        className="hover:underline"
                      >
                        <h3 className="font-semibold">
                          {user.name || "Anonymous"}
                        </h3>
                      </Link>
                      {user.rank <= 3 && <>{getRankBadge(user.rank)}</>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{user._count.userItems} weapons collected</span>
                      <span> • </span>
                      <span>
                        {stats?.totalItems && stats.totalItems > 0
                          ? `${Math.round(
                              (user._count.userItems / stats.totalItems) * 100
                            )}%`
                          : "N/A"}
                      </span>
                    </div>
                    {user.platform && user.vaultHunter && (
                      <div className="flex gap-2 mt-2 sm:justify-normal justify-center">
                        <Badge className="bg-black border-primary-green/75 text-primary-green">
                          {user.platform}
                        </Badge>
                        <Badge className="bg-black border-primary-green/75 text-primary-green">
                          {user.vaultHunter}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Points */}
                  <div className="sm:text-right text-center">
                    <div className="text-xl font-bold text-yellow-400">
                      {user.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              <div className="flex items-center justify-between pt-6">
                <Button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="text-black hover:opacity-90 bg-primary-green hover:bg-primary-green/75 "
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-primary-green">
                    Page {page + 1}
                  </span>
                </div>

                <Button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!users || users.length < ITEMS_PER_PAGE}
                  className="text-black hover:opacity-90 bg-primary-green hover:bg-primary-green/75 "
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hunters on the leaderboard yet.</p>
              <p className="text-sm mt-2">Be the first to start collecting!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
