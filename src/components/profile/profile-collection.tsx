"use client";
import { rarityColors } from "@/lib/item-changes";
import { api } from "@/lib/trpc/client";
import { User } from "@prisma/client";
import { Target } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type Props = {
  user: User & {
    role?: string;
    totalPoints?: number;
  };
};

export default function ProfileCollection({ user }: Props) {
  const {
    data: progress,
    isLoading: progressLoading,
    error: progressError,
  } = api.user.getPublicStats.useQuery({
    username: user.name,
  });

  const {
    data: userProgress,
    isLoading: userProgressLoading,
    error: userProgressError,
  } = api.item.getUserProgressByUsername.useQuery({
    username: user.name,
  });

  if (progressLoading || userProgressLoading) {
    return (
      <div className="min-h-screen w-full relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
        </div>
      </div>
    );
  }

  // Add error handling
  if (progressError || userProgressError) {
    return (
      <div className="min-h-screen w-full relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500">
            Error loading data:{" "}
            {progressError?.message || userProgressError?.message}
          </div>
        </div>
      </div>
    );
  }

  const obtainedItems = progress?.itemsObtained || 0;

  // Filter obtained weapons first
  const obtainedWeapons =
    userProgress?.filter((w) => w.isObtained === true) || [];

  return (
    <Card className="bg-black/20 border-white/10 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Collected Weapons ({obtainedItems})
        </CardTitle>
        <CardDescription>
          Weapons you&apos;ve successfully submitted and had approved.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {obtainedWeapons.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {obtainedWeapons.map((weapon) => (
              <div
                key={weapon.id}
                className="border border-white/10 rounded-lg p-4 bg-white/5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>(typeIcons[weapon?.type])</span>
                    <div>
                      <div className="font-semibold">{weapon.name}</div>
                      <div className="text-sm text-gray-400">
                        {weapon.source}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`${
                      rarityColors[weapon.rarity]
                    } text-white text-xs`}
                  >
                    {weapon.rarity}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Points:</span>
                  <span className="font-semibold text-yellow-400">
                    +{weapon.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No weapons collected yet. Start hunting!</p>
            <Link href="/dashboard/checklist">
              <Button className="mt-4 text-black bg-primary-green hover:bg-primary-green/75">
                View Checklist
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
