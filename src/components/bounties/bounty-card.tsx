"use client";

import { Bounty } from "@prisma/client";
import {
  Banknote,
  Calendar,
  CheckCircle,
  Clock,
  User2,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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

import { bountyClaimSchema } from "@/app/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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

type Props = {
  bounty: Bounty & {
    issuer: {
      image: string | null;
      name: string;
    };
  };
  onSubmit: (bountyId: string, clipUrl: string, message?: string) => void;
  isSubmitting: boolean;
};

type BountyClaimValues = z.infer<typeof bountyClaimSchema>;

// Bounty Item Card
// TODO: Will be the card for each bounty displaying the name, creator, price, notes?, submit button so we can have a dialog
export const BountyCard = ({ bounty, onSubmit, isSubmitting }: Props) => {
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);

  const form = useForm<BountyClaimValues>({
    resolver: zodResolver(bountyClaimSchema),
    defaultValues: {
      twitchClipUrl: "",
      bountyId: bounty.id,
      message: "",
    },
  });

  const handleSubmit = useCallback(
    (data: BountyClaimValues) => {
      onSubmit(data.bountyId, data.twitchClipUrl, data.message);
    },
    [onSubmit]
  );

  const handleClaimDialogOpen = useCallback(() => {
    form.setValue("bountyId", bounty.id);
    setIsClaimDialogOpen(true);
  }, [form, bounty.id]);

  return (
    <Card className="bg-black/20 border-white/10 relative w-full text-white ">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-2xl">{bounty.title}</span>
            </CardTitle>
            <CardDescription className="text-gray-300 flex items-center gap-1 mt-2">
              <Avatar>
                <AvatarImage
                  src={bounty.issuer.image || ""}
                  alt={bounty.issuer.name}
                />
                <AvatarFallback className="bg-background text-primary-green-foreground">
                  <User2 />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col ml-1">
                {bounty.issuer.name}
                <span className="text-muted-foreground text-xs">Issuer</span>
              </div>
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            {bounty.status && (
              <Badge
                variant={
                  bounty.status === "COMPLETED"
                    ? "default"
                    : bounty.status === "CLAIMED"
                    ? "secondary"
                    : "destructive"
                }
                className="text-xs text-white border-primary-green bg-black/50 absolute top-4 right-4 capitalize"
              >
                {bounty.status === "COMPLETED" && (
                  <CheckCircle className="h-3 w-3 mr-1" />
                )}
                {bounty.status === "OPEN" && <Clock className="h-3 w-3 mr-1" />}
                {(bounty.status === "CANCELLED" ||
                  bounty.status === "EXPIRED") && (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {bounty.status === "CLAIMED" && (
                  <Banknote className="h-3 w-3 mr-1" />
                )}
                {bounty.status}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 text-sm">
          <div>
            <span>Price:</span>
            <span className="ml-2 font-semibold text-yellow-400">
              ${bounty.price}
            </span>
          </div>

          {bounty.description && (
            <div>
              <span>Description:</span>
              <span className="ml-2 font-semibold wrap-anywhere">
                {bounty.description}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="w-full flex-1">
        <div className="flex gap-2 mt-2 w-full justify-between">
          <div className="flex gap-1 items-center">
            <Calendar className="w-4 h-4 text-primary-green" />
            <span className=" text-muted-foreground">
              Issue Date: {new Date(bounty.createdAt).toLocaleDateString()}
            </span>
          </div>

          <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className=" mt-4 shrink-0 text-black bg-primary-green hover:bg-primary-green/75 hover:opacity-90"
                disabled={
                  bounty.status === "CLAIMED" ||
                  bounty.status === "COMPLETED" ||
                  bounty.status === "EXPIRED" ||
                  bounty.status === "CANCELLED" ||
                  bounty.status === "PENDING" ||
                  isSubmitting
                }
                onClick={handleClaimDialogOpen}
              >
                Claim
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-primary-green">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Submit Evidence for {bounty.title}
                </DialogTitle>
                <DialogDescription className="text-white">
                  Provide evidence that you&apos;ve obtained this bounty.
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
                      name="twitchClipUrl"
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

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe what you got."
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
