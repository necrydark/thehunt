"use client";

import { api } from "@/lib/trpc/client";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { WeaponCard } from "./weapon-card";

export default function Checklist() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [rarity, setRarity] = useState("");

  const utils = api.useUtils();

  const submitMutation = api.submission.create.useMutation({
    onSuccess: async () => {
      toast("Evidence Submitted.");
      utils.item.getUserProgress.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to submit evidence. Please try again.");
      console.error("Submission error:", error);
    },
  });

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: allItems,
    isLoading: allItemsLoading,
    error: allItemsError,
  } = api.item.getAll.useQuery(
    {
      search: debouncedSearchQuery,
      limit: 370,
      category: category === " " ? undefined : category,
      rarity: rarity === " " ? undefined : parseInt(rarity) || undefined,
    },
    {
      placeholderData: (prev) => prev,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      enabled: true,
    }
  );

  const {
    data: userProgress,
    isLoading: userProgressLoading,
    error: userProgressError,
  } = api.item.getUserProgress.useQuery(undefined, {
    staleTime: 2 * 60 * 1000,
  });

  const handleSubmit = useCallback(
    (itemId: string, clipUrl: string) => {
      submitMutation.mutate({
        itemId,
        twitchClipUrl: clipUrl,
      });
    },
    [submitMutation]
  );

  const mergedItems = useMemo(() => {
    if (!allItems || !userProgress) {
      return [];
    }

    const progressMap = new Map(
      userProgress.map((p) => [p.id, p.userItemStatus])
    );

    return allItems.map((item) => ({
      ...item,
      userItemStatus: progressMap.get(item.id) || "Not Submitted",
    }));
  }, [allItems, userProgress]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
  }, []);

  const handleRarityChange = useCallback((value: string) => {
    setRarity(value);
  }, []);

  if (allItemsLoading || userProgressLoading) {
    return (
      <div>
        <h1 className="mt-8 text-3xl text-primary-green">Loading Items...</h1>
      </div>
    );
  }

  if (allItemsError || userProgressError) {
    return (
      <div className="min-h-screen w-full relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500">
            Error loading data:{" "}
            {allItemsError?.message || userProgressError?.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="mb-8 bg-black/20 border-white/10 text-white">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search weapons..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Types</SelectItem>
                <SelectItem value="PSTL">Pistol</SelectItem>
                <SelectItem value="SHTGN">Shotgun</SelectItem>
                <SelectItem value="SMG">SMG</SelectItem>
                <SelectItem value="AR">Assault Rifle</SelectItem>
                <SelectItem value="SNPR">Sniper Rifle</SelectItem>
                <SelectItem value="LNCHR">Rocket Launcher</SelectItem>
                <SelectItem value="GRND">Grenade</SelectItem>
                <SelectItem value="SHLD">Shield</SelectItem>
                <SelectItem value="Com">Class Mod</SelectItem>
                <SelectItem value="ARTF">Artifact</SelectItem>
              </SelectContent>
            </Select>
            <Select value={rarity} onValueChange={handleRarityChange}>
              <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Filter by rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Rarities</SelectItem>
                <SelectItem value="1">Common</SelectItem>
                <SelectItem value="2">Uncommon</SelectItem>
                <SelectItem value="3">Rare</SelectItem>
                <SelectItem value="4">Epic</SelectItem>
                <SelectItem value="5">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {mergedItems.map((weapon) => (
          <WeaponCard
            key={weapon.id}
            weapon={weapon}
            onSubmit={handleSubmit}
            isSubmitting={submitMutation.isPending}
          />
        ))}
      </div>
    </>
  );
}
