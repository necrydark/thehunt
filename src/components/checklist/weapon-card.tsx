/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { bountySchema, weaponSubmission } from "@/app/schemas/schema";
import {
  itemRarity,
  itemTypes,
  rarityColors,
  typeIcons,
} from "@/lib/item-changes";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Clock, Plus, XCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type WeaponSubmissionValues = z.infer<typeof weaponSubmission>;
type WeaponBountySubmissionValues = z.infer<typeof bountySchema>;

export const WeaponCard = ({
  weapon,
  onSubmit,
  bountySubmit,
  isSubmitting,
}: {
  weapon: any;
  onSubmit: (weaponId: string, clipUrl: string) => void;
  bountySubmit: (
    itemId: string,
    title: string,
    price: number,
    description: string
  ) => void;
  isSubmitting: boolean;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBountyDialogOpen, setIsBountyDialogOpen] = useState(false);

  const form = useForm<WeaponSubmissionValues>({
    resolver: zodResolver(weaponSubmission),
    defaultValues: {
      twitchClipLink: "",
      itemId: weapon.id,
    },
  });

  const bountyForm = useForm<WeaponBountySubmissionValues>({
    resolver: zodResolver(bountySchema),
    defaultValues: {
      itemId: weapon.id,
      price: 0,
      name: "",
      description: "",
    },
  });

  const handleSubmit = useCallback(
    (data: WeaponSubmissionValues) => {
      onSubmit(data.itemId, data.twitchClipLink);
      setIsDialogOpen(false);
    },
    [onSubmit]
  );

  const handleBountySubmit = useCallback(
    (data: WeaponBountySubmissionValues) => {
      bountySubmit(data.itemId, data.name, data.price, data.description);
      setIsBountyDialogOpen(false);
    },
    [bountySubmit]
  );

  const handleDialogOpen = useCallback(() => {
    form.setValue("itemId", weapon.id);
    setIsDialogOpen(true);
  }, [form, weapon.id]);

  const handleBountyDialogOpen = useCallback(() => {
    bountyForm.setValue("itemId", weapon.id);
    setIsBountyDialogOpen(true);
  }, [bountyForm, weapon.id]);
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
      </CardContent>
      <CardFooter className="w-full flex-1">
        <div className="flex gap-2 mt-2 flex-1">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex-1 mt-4 text-black hover:opacity-90"
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
                  Provide evidence that you&apos;ve obtained this weapon.
                  Include the Twitch clip link.
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

          <Dialog
            open={isBountyDialogOpen}
            onOpenChange={setIsBountyDialogOpen}
          >
            <DialogTrigger asChild>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    className=" mt-4 shrink-0 text-primary-green border-[1px] bg-black hover:bg-black/75 border-primary-green hover:opacity-90"
                    size={"icon"}
                    onClick={handleBountyDialogOpen}
                  >
                    <Plus className=" h-4 w-4" />
                  </Button>
                  <TooltipContent>
                    <p>Create Bounty for {weapon.name}</p>
                  </TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </DialogTrigger>
            <DialogContent className="bg-black border-primary-green">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Create a bounty for {weapon.name}
                </DialogTitle>
                <DialogDescription className="text-white">
                  Create a community bounty.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Form {...bountyForm}>
                  <form
                    className="space-y-6"
                    onSubmit={bountyForm.handleSubmit(handleBountySubmit)}
                  >
                    <div className="flex gap-4 items-center">
                      <FormField
                        control={bountyForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Bounty Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Perfect Roll Sham"
                                className="bg-black border-primary-green text-white focus-visible:ring-primary-green "
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={bountyForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Price</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min={1}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="bg-black border-primary-green text-white focus-visible:ring-primary-green "
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={bountyForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe what you want the claimer to obtain. e.g 94% Sham"
                              className="bg-black h-[200px] resize-none border-primary-green text-white focus-visible:ring-primary-green "
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
        </div>
      </CardFooter>
    </Card>
  );
};
