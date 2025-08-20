/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { weaponSubmission } from "@/app/schemas/schema";
import {
  itemRarity,
  itemTypes,
  rarityColors,
  typeIcons,
} from "@/lib/item-changes";
import { api } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Clock, Search, XCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type WeaponSubmissionValues = z.infer<typeof weaponSubmission>;

const WeaponCard = ({
  weapon,
  onSubmit,
  isSubmitting,
}: {
  weapon: any;
  onSubmit: (weaponId: string) => void;
  isSubmitting: boolean;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<WeaponSubmissionValues>({
    resolver: zodResolver(weaponSubmission),
    defaultValues: {
      twitchClipLink: "",
      itemId: weapon.id,
    },
  });

  const handleSubmit = useCallback(
    (data: WeaponSubmissionValues) => {
      onSubmit(data.itemId);
      setIsDialogOpen(false);
    },
    [onSubmit]
  );

  const handleDialogOpen = useCallback(() => {
    form.setValue("itemId", weapon.id);
    setIsDialogOpen(true);
  }, [form, weapon.id]);

  return (
    <Card className="bg-black/20 border-white/10 text-white relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-2xl">
                {typeIcons[itemTypes(weapon.type)]}
                {weapon.name}
              </span>
            </CardTitle>
            <CardDescription className="text-gray-300 mt-1">
              {weapon.source}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge
              className={`${rarityColors[weapon.rarity]} text-white capitalize`}
            >
              {itemRarity(weapon.rarity)}
            </Badge>
            {weapon.userItemStatus && (
              <Badge
                variant={
                  weapon.userItemStatus === "Approved"
                    ? "default"
                    : weapon.userItemStatus === "Pending"
                    ? "secondary"
                    : "destructive"
                }
                className="text-xs"
              >
                {weapon.userItemStatus === "Approved" && (
                  <CheckCircle className="h-3 w-3 mr-1" />
                )}
                {weapon.userItemStatus === "Pending" && (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                {weapon.userItemStatus === "Rejected" && (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {weapon.userItemStatus}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 text-sm">
          <div>
            <span>Points:</span>
            <span className="ml-2 font-semibold text-yellow-400">
              {weapon.points}
            </span>
          </div>
          <div>
            <span>Mayhem:</span>
            <span className="ml-2 font-semibold ">{weapon.mayhem}</span>
          </div>
          <div>
            <span>Type:</span>
            <span className="ml-2 font-semibold text-yellow-400">
              {itemTypes(weapon.type)}
            </span>
          </div>
          <div>
            <span>Group:</span>
            <span className="ml-2 font-semibold text-yellow-400">
              {weapon.listGroup}
            </span>
          </div>
          <div>
            <span>Mission:</span>
            <span className="ml-2 font-semibold text-yellow-400">
              {weapon.missionType}
            </span>
          </div>
          <div>
            <span>Maps:</span>
            <span className="ml-2 font-semibold text-yellow-400">
              {weapon.maps}
            </span>
          </div>
        </div>
        {weapon.notes && (
          <div>
            <span className="text-gray-400 text-sm">Notes</span>
            <p className="text-sm text-gray-300 mt-1">{weapon.notes}</p>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full mt-4 text-black hover:opacity-90"
              style={{
                backgroundColor:
                  weapon.userItemStatus === "Approved"
                    ? "rgb(107 114 128)"
                    : "oklch(0.9181 0.2323 126.72)",
              }}
              disabled={
                weapon.userItemStatus === "Pending" ||
                weapon.userItemStatus === "Approved" ||
                isSubmitting
              }
              onClick={handleDialogOpen}
            >
              {weapon.userItemStatus === "Approved"
                ? "Completed"
                : weapon.userItemStatus === "Pending"
                ? "Pending Review"
                : weapon.userItemStatus === "Rejected"
                ? "Resubmit"
                : isSubmitting
                ? "Submitting..."
                : "Submit"}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-primary-green">
            <DialogHeader>
              <DialogTitle className="text-white">
                Submit {weapon.name}
              </DialogTitle>
              <DialogDescription className="text-white">
                Provide evidence that you&apos;ve obtained this weapon. Include
                the Twitch clip link.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(handleSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="twitchClipLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Twitch Clip URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://www.twitch.tv/[username]/clip/"
                            className="bg-black border-primary-green text-white focus-visible:ring-primary-green "
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="bg-primary-green hover:bg-primary-green/50 cursor-pointer text-black"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

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

  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: allItems,
    isLoading: allItemsLoading,
    error: allItemsError,
  } = api.item.getAll.useQuery({
    search: debouncedSearchQuery,
    limit: 370,
    category: category === " " ? undefined : category,
    rarity: rarity === " " ? undefined : parseInt(rarity) || undefined,
  });

  const {
    data: userProgress,
    isLoading: userProgressLoading,
    error: userProgressError,
  } = api.item.getUserProgress.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  const handleSubmit = useCallback(
    (itemId: string) => {
      submitMutation.mutate({
        itemId,
        twitchClipUrl: "",
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
        <h1 className="text-3xl text-white">Loading Items...</h1>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
