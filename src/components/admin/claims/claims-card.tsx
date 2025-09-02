"use client";
import { claimReview } from "@/app/schemas/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { BountyClaim } from "@prisma/client";
import { Calendar, CheckCircle, Eye, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type Props = {
  claimer: {
    id: string;
    name: string;
    image: string | null;
  };
  claim: BountyClaim;
};

type ClaimValues = z.infer<typeof claimReview>;

export default function ClaimsCard({ claimer, claim }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const utils = api.useUtils();

  const updateMutation = api.bounty.reviewClaim.useMutation({
    onSuccess: async () => {
      toast("Claim Reviewed");
      form.reset();
      setIsDialogOpen(false);

      await utils.bounty.getAll.invalidate();
    },
    onError: (err) => {
      toast.error("Failed to submit review. Please try again");
      console.error("Submission error:", err);
    },
  });

  const form = useForm<ClaimValues>({
    resolver: zodResolver(claimReview),
    defaultValues: {
      id: "",
      status: "REJECTED",
      feedback: "",
    },
  });

  const handleSubmit = (data: ClaimValues) => {
    updateMutation.mutate({
      claimId: data.id,
      status: data.status,
      feedback: data.feedback,
    });
  };

  const handleAccept = async () => {
    form.setValue("status", "ACCEPTED");
    try {
      await form.handleSubmit(handleSubmit)();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Open failed:", error);
    }
  };

  const handleReject = async () => {
    form.setValue("status", "REJECTED");
    try {
      await form.handleSubmit(handleSubmit)();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Cancelled failed:", error);
    }
  };

  return (
    <Card
      key={claim.id}
      className="border border-white/10 rounded-xl p-6 bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 group"
    >
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="border border-primary-green w-[50px] h-[50px]">
              <AvatarImage
                width={50}
                height={50}
                src={claimer?.image as string}
                alt={`${claimer?.name}'s Avatar`}
              />
              <AvatarFallback
                className="text-white text-2xl"
                style={{
                  backgroundColor: "oklch(0.9181 0.2323 126.72)",
                }}
              >
                {claimer?.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h1 className="text-primary-green">
                {claimer?.name}
                <span className="text-gray-400 ml-1">submitted</span>
              </h1>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Badge
              className={cn(
                claim.status === "ACCEPTED" && "bg-primary-green text-black",
                claim.status === "PENDING" && "bg-yellow-600",
                claim.status === "REJECTED" && "bg-red-600"
              )}
            >
              {claim.status.charAt(0).toUpperCase() +
                claim.status.slice(1).toLowerCase()}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t-primary-green border-t-[1px] pt-4 items-center">
        <div className="flex gap-2">
          <span className="text-gray-400 gap-1 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Submitted: {new Date(claim.claimedAt).toLocaleDateString()}
          </span>
          <span className="text-gray-400 gap-1 flex items-center">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            Reviewed:{" "}
            {claim.updatedAt
              ? new Date(claim.updatedAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  form.setValue("id", claim.id);
                  setIsDialogOpen(true);
                }}
                disabled={
                  claim.status === "ACCEPTED" ||
                  claim.status === "COMPLETED" ||
                  claim.status === "REJECTED"
                }
                className="bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg transition-all duration-300"
              >
                {claim.status === "ACCEPTED" ||
                claim.status === "COMPLETED" ||
                claim.status === "REJECTED" ? (
                  <>Reviewed</>
                ) : (
                  <>
                    <Eye className="h-4 w-4 " />
                    Review
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black backdrop-blur-md border-primary-green/50 text-white max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Review Claim</DialogTitle>
                <DialogDescription>
                  Review the evidence and approve or reject this bounty claim
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Form {...form}>
                  <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(handleSubmit)}
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex justify-center flex-col space-y-2 ">
                        <span className="text-sm text-gray-400">User</span>
                        <span className="text-primary-green">
                          {claimer.name}
                        </span>
                      </div>
                      <div className="flex justify-center flex-col space-y-2 ">
                        <span className="text-sm text-gray-400">Claimed</span>
                        <span className="text-primary-green">
                          {new Date(claim.claimedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm text-gray-400">Evidence</span>
                      <Link
                        href={claim.clipUrl}
                        target="_blank"
                        className="text-primary-green"
                      >
                        {claim.clipUrl.slice(0, 25)}...
                      </Link>
                    </div>
                    <FormField
                      control={form.control}
                      name="feedback"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-400 text-xs items-start flex flex-col">
                            Rejection Reason
                            <span className="text-[10px] text-gray-400">
                              (Only add if you&apos;re rejecting otherwise leave
                              blank).
                            </span>
                          </FormLabel>

                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Rejection Reason"
                              className="bg-black border-primary-green resize-none h-[100px] text-white focus-visible:ring-primary-green "
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        onClick={handleReject}
                        className="bg-red-500 text-white transition-all duration-300 hover:bg-red-500/60"
                        disabled={updateMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        {updateMutation.isPending ? "Rejecting..." : "Reject"}
                      </Button>

                      <Button
                        type="button"
                        onClick={handleAccept}
                        className="bg-primary-green text-black transition-all duration-300 hover:bg-primary-green/60"
                        disabled={updateMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {updateMutation.isPending ? "Accepting..." : "Accept"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}
