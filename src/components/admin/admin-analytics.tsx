"use client";

import { api } from "@/lib/trpc/client";
import { Calendar, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function AdminAnalytics() {
  const {
    data: adminStats,
    isLoading: adminStatsLoading,
    error: adminStatsError,
  } = api.admin.getAllStats.useQuery();

  if (adminStatsLoading) {
    return (
      <div className="relative mt-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
        </div>
      </div>
    );
  }

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

  const getSubmissionUser = (userId: string) => {
    return adminStats?.users.find((u) => u.id === userId);
  };

  const getSubmissionItem = (itemId: string) => {
    return adminStats?.items.find((i) => i.id === itemId);
  };

  const approvedSubmissions = adminStats?.reviews.filter(
    (r) => r.status === "APPROVED"
  ).length;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-black/30 backdrop-blur-sm border-white/10 text-white hover:bg-black/40 transition-all duration-300 group">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-6 w-6 text-primary-green" />
            Event Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-400">
                {adminStats?.userCount}
              </div>
              <div className="text-sm text-gray-400">Total Participants</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-400">
                {approvedSubmissions}
              </div>
              <div className="text-sm text-gray-400">Weapons Found</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-400">
                {adminStats?.totalPointsAggregate._sum.totalPoints}
              </div>
              <div className="text-sm text-gray-400">Points Awarded</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-yellow-400">
                {adminStats?.weaponCount && approvedSubmissions !== undefined
                  ? `${Math.round(
                      (approvedSubmissions / adminStats.weaponCount) * 100
                    )}%`
                  : "0%"}
              </div>
              <div className="text-sm text-gray-400">Completion Rate</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-fuchsia-400">
                {adminStats?.bounties.length}
              </div>
              <div className="text-sm text-gray-400">Bounties Created</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-indigo-400">
                {
                  adminStats?.bounties.filter((b) => b.status === "COMPLETED")
                    .length
                }
              </div>
              <div className="text-sm text-gray-400">Bounties Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-black/30 backdrop-blur-sm border-white/10 text-white hover:bg-black/40 transition-all duration-300 group">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-6 w-6 text-primary-green" />
            Recent Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adminStats?.reviews && adminStats?.reviews.length > 0 ? (
              <>
                {adminStats?.reviews
                  .sort(
                    (a, b) =>
                      new Date(b.submittedAt).getTime() -
                      new Date(a.submittedAt).getTime()
                  )
                  .slice(0, 5)
                  .map((submission) => {
                    const user = getSubmissionUser(submission.userId);
                    const item = getSubmissionItem(submission.itemId);
                    return (
                      <div
                        key={submission.id}
                        className="flex items-center gap-3 text-sm"
                      >
                        <Avatar className="w-6 h-6 ring-2 ring-white/10 group-hover:ring-white/20 transition-all">
                          <AvatarImage
                            src={user?.image as string}
                            alt={`${user?.name}'s Avatar`}
                          />
                          <AvatarFallback className="text-white">
                            {user?.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <span className="font-medium">{user?.name}</span>
                          <span className="text-gray-400"> submitted </span>
                          <span className="font-medium">{item?.name}</span>
                        </div>
                        <div className="text-gray-400 text-xs">
                          {(() => {
                            const date = new Date(submission.submittedAt);
                            return isNaN(date.getTime())
                              ? submission.submittedAt
                              : date.toLocaleDateString();
                          })()}
                        </div>
                      </div>
                    );
                  })}
              </>
            ) : (
              <div>
                <span>
                  There has been no recent activity, please check again later.
                </span>
              </div>
            )}
            {/* {adminStats?.reviews
              ?.slice() // create a shallow copy to avoid mutating original array
              .sort(
                (a, b) =>
                  new Date(b.submittedAt).getTime() -
                  new Date(a.submittedAt).getTime()
              )
              .slice(0,5)
              .map((review) => (
                <div
                  key={review.id}
                  className="p-3 rounded flex items-center text-sm bg-white/5 border border-white/10"
                >
                  <Avatar className="w-6 h-6 ring-2 ring-white/10 group-hover:ring-white/20 transition-all">
                    <AvatarImage src={review.} />
                  </Avatar>
                </div>
              ))} */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
