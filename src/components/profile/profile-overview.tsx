"use client";
import { itemTypes, typeIcons } from "@/lib/item-changes";
import { api } from "@/lib/trpc/client";
import { User } from "@prisma/client";
import { Star, TrendingUp } from "lucide-react";
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
    data: submissions,
    isLoading: submissionsLoading,
    error: submissionsError,
  } = api.submission.getUserSubmissions.useQuery({
    limit: 3,
    status: "APPROVED",
  });

  if (progressLoading || itemsLoading || submissionsLoading) {
    return (
      <div className="min-h-screen w-full relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
        </div>
      </div>
    );
  }

  // Add error handling
  if (progressError || itemsError || submissionsError) {
    return (
      <div className="min-h-screen w-full relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500">
            Error loading data:{" "}
            {progressError?.message ||
              itemsError?.message ||
              submissionsError?.message}
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
        <CardContent>
          <div className="flex justify-between text-sm">
            <span>Weapons Collected</span>
            <span>
              {progress?.itemsObtained}/{items?.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-black" />
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
          <div>
            {submissions && submissions?.length > 0 ? (
              <div>
                {submissions.map((submission) => {
                  const weapon = items?.find((w) => w.id === submission.id);

                  return (
                    <div
                      key={submission.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="text-lg">
                        {weapon ? typeIcons[itemTypes(weapon?.type)] : "?"}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {weapon?.name || "Unknown Weapon"}
                        </div>
                        <div className="text-gray-400">
                          {submission.submittedAt
                            ? new Date(submission.submittedAt).toLocaleString(
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
                          +{weapon?.points || 0}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <h1>You have no recent activity.</h1>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
