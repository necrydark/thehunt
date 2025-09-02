"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { itemTypes, typeIcons } from "@/lib/item-changes";
import { api } from "@/lib/trpc/client";
import { User } from "@prisma/client";
import { Star, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

type Props = {
  user: User & {
    role?: string;
    totalPoints?: number;
  };
};

export default function ProfileOverview({ user }: Props) {
  const [currentTab, setCurrentTab] = useState("submissions");

  const {
    data: progress,
    isLoading: progressLoading,
    error: progressError,
  } = api.user.getPublicStats.useQuery({
    username: user.name,
  });

  const { data: itemsPoints } = api.item.getItemStats.useQuery();
  const {
    data: items,
    isLoading: itemsLoading,
    error: itemsError,
  } = api.item.getAll.useQuery({ limit: 400 });

  const {
    data: submissions,
    isLoading: submissionsLoading,
    error: submissionsError,
  } = api.submission.getUserSubmissionsByUsername.useQuery({
    limit: 3,
    username: user.name,
  });

  const {
    data: claims,
    isLoading: claimsLoading,
    error: claimsError,
  } = api.bounty.getUserClaimsByUsername.useQuery({
    limit: 3,
    userId: user.id,
  });

  if (progressLoading || itemsLoading || submissionsLoading || claimsLoading) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center ">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
        </div>
      </div>
    );
  }

  // Add error handling
  if (progressError || itemsError || submissionsError || claimsError) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center ">
          <div className="text-red-500">
            Error loading data:{" "}
            {progressError?.message ||
              itemsError?.message ||
              submissionsError?.message ||
              claimsError?.message}
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
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="bg-black/20 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Weapons Collected</span>
              <span>
                {progress?.itemsObtained}/{items?.length}
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-3 bg-black [&>div]:bg-primary-green"
            />
          </div>

          <div className="flex justify-between text-sm">
            <span>Total Points</span>
            <span>
              {progress?.totalPoints}/{itemsPoints?.totalPoints}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Bounties Claimed</span>
            <span>{progress?.bountyClaims ?? 0}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="bg-primary-green text-white grid grid-cols-2 mb-4">
              <TabsTrigger
                value="submissions"
                className={
                  currentTab === "submissions"
                    ? "data-[state=active]:bg-black data-[state=active]:text-white"
                    : "bg-transparent"
                }
              >
                Submissions
              </TabsTrigger>
              <TabsTrigger
                value="claims"
                className={
                  currentTab === "claims"
                    ? "data-[state=active]:bg-black data-[state=active]:text-white"
                    : "bg-transparent"
                }
              >
                Claims
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submissions">
              <div className="space-y-3">
                {submissions && submissions?.length > 0 ? (
                  <>
                    {submissions.map((submission) => {
                      return (
                        <div
                          key={submission.id}
                          className="flex items-center gap-3 text-sm bg-black/20 border-primary-green border-[1px] p-4 rounded-md"
                        >
                          <div className="text-lg">
                            {submission.item
                              ? typeIcons[itemTypes(submission?.item?.type)]
                              : "?"}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="font-medium">
                              {submission?.item?.name || "Unknown Weapon"}
                            </div>
                            <div className="text-gray-400">
                              {submission.submittedAt
                                ? new Date(
                                    submission.submittedAt
                                  ).toLocaleString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Unknown date"}
                            </div>
                            <Badge className="bg-primary-green text-black">
                              +{submission?.item?.points || 0}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div>
                    <h1>{user.name} has no recent submissions.</h1>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="claims">
              <div className="space-y-3">
                {claims && claims?.length > 0 ? (
                  <>
                    {claims.map((claim) => {
                      return (
                        <div
                          key={claim.id}
                          className="flex items-center gap-3 text-sm bg-black/20 border-primary-green border-[1px] p-4 rounded-md"
                        >
                          <div className="flex-1 space-y-1">
                            <div className="font-medium">
                              {claim.bounty.title || "Unknown Claim"}
                            </div>
                            <div className="text-gray-400">
                              {claim.claimedAt
                                ? new Date(claim.claimedAt).toLocaleString(
                                    undefined,
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : "Unknown date"}
                            </div>
                            <Badge className="bg-primary-green text-black">
                              {claim.bounty.price || 0}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div>
                    <h1>{user.name} has no recent claims.</h1>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
