"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/trpc/client";
import { User } from "@prisma/client";
import { Calendar, Target, Trophy } from "lucide-react";
import { Badge } from "../ui/badge";

type Props = {
  user: User & {
    role?: string;
    totalPoints?: number;
  };
};

export default function ProfileHeader({ user }: Props) {
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

  if (progressLoading || itemsLoading) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
        </div>
      </div>
    );
  }

  // Add error handling
  if (progressError || itemsError) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center]">
          <div className="text-red-500">
            Error loading data: {progressError?.message || itemsError?.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="mb-8 bg-black/20 border-white/10 text-white">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={user?.image || "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback
              className="text-white text-2xl"
              style={{ backgroundColor: "oklch(0.9181 0.2323 126.72)" }}
            >
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <Badge className={`bg-transparent border-current`}>
                {user.role}
              </Badge>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {user.createdAt.toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-yellow-400" />
                {user.totalPoints} Points
              </span>
              <span className="flex items-center gap-1">
                <Target
                  className="h-4 w-4"
                  style={{ color: "oklch(0.9181 0.2323 126.72)" }}
                />
                {progress?.itemsObtained}/{items?.length} Weapons
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
