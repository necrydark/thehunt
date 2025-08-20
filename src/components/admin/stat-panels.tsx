"use client";

import { api } from "@/lib/trpc/client";
import { Check, Clock, Medal, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function StatPanels() {
  const {
    data: adminStats,
    isLoading: adminStatsLoading,
    error: adminStatsError,
  } = api.admin.getAllStats.useQuery();

  if (adminStatsLoading) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
        </div>
      </div>
    );
  }

  // Add error handling
  if (adminStatsError) {
    return (
      <div className=" relative">
        <div className="flex items-center justify-center">
          <div className="text-red-500">
            Error loading data: {adminStatsError?.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-4 grid-cols-2 gap-6 mb-8">
      <Card className="bg-black/30 backdrop-blur-sm border-white/10 text-white hover:bg-black/40 transition-all duration-300 group">
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Users</p>
              <p className="text-3xl text-blue-400 font-bold  transition-transform">
                {adminStats?.userCount}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-500/20 border border-blue-500/30">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-black/30 backdrop-blur-sm border-white/10 text-white hover:bg-black/40 transition-all duration-300 group">
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Pending Reviews</p>
              <p className="text-3xl text-yellow-400 font-bold  transition-transform">
                {
                  adminStats?.reviews.filter((r) => r.status === "PENDING")
                    .length
                }
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500/20 border border-yellow-500/30">
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-black/30 backdrop-blur-sm border-white/10 text-white hover:bg-black/40 transition-all duration-300 group">
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Approved Reviews</p>
              <p className="text-3xl text-green-400 font-bold  transition-transform">
                {
                  adminStats?.reviews.filter((r) => r.status === "APPROVED")
                    .length
                }
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-500/20 border border-green-500/30">
              <Check className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-black/30 backdrop-blur-sm border-white/10 text-white hover:bg-black/40 transition-all duration-300 group">
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Points</p>
              <p className="text-3xl text-purple-400 font-bold  transition-transform">
                {adminStats?.totalPointsAggregate._sum.totalPoints}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-500/20 border border-purple-500/30">
              <Medal className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
