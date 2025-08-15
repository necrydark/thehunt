"use client";

import { api } from "@/lib/trpc/client";
import { User } from "better-auth";
import { Target } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";

type Props = {
  user: User;
};

export default function ChecklistHeader({ user }: Props) {
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

  if (progressLoading || itemsLoading) {
    return (
      <div className="min-h-screen w-full relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
        </div>
      </div>
    );
  }

  // Add error handling
  if (progressError || itemsError) {
    return (
      <div className="min-h-screen w-full relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500">
            Error loading data: {progressError?.message || itemsError?.message}
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
    <Card className="mb-8 bg-black/20 border-white/10 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target
            className="h-5 w-5"
            style={{ color: "oklch(0.9181 0.2323 126.72)" }}
          />
          Collection Progress
        </CardTitle>
        <CardDescription className="text-gray-300">
          Track your weapon hunting progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>
              {obtainedItems}/{totalItems} ({Math.round(progressPercentage)}%)
            </span>
          </div>
          <Progress
            value={progressPercentage || 0}
            className="h-3 bg-black [&>div]:bg-primary-green"
          />
        </div>
      </CardContent>
    </Card>
  );
}
