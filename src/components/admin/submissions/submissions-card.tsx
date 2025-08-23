'use client'
import { Item, Submission, User } from '@prisma/client'
import React, { useState } from 'react'
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
import { Calendar, CheckCircle, Eye, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { itemTypes } from '@/lib/item-changes';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submissionReview } from "@/app/schemas/schema";
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { api } from '@/lib/trpc/client';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';




type Props = {
    submission: Submission;
    item: Item
    user: User
}

type SubmissionValues = z.infer<typeof submissionReview>;


export default function SubmissionCard({ submission, item, user}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const utils = api.useUtils();

  const updateMutation = api.submission.review.useMutation({
    onSuccess: async () => {
      toast("Review Submitted");
      form.reset();
      setIsDialogOpen(false);

      await utils.submission.getAll.invalidate();
    },
    onError: (err) => {
      toast.error("Failed to submit evidence. Please try again");
      console.error("Submission error:", err);
    },
  });

  const form = useForm<SubmissionValues>({
    resolver: zodResolver(submissionReview),
    defaultValues: {
      id: "",
      rejectionReason: "",
      status: "REJECTED",
    },
  });

  const handleSubmit = (data: SubmissionValues) => {
    updateMutation.mutate({
      id: data.id,
      status: data.status,
      rejectionReason: data.rejectionReason,
    });
  };

  const handleApprove = async () => {
    form.setValue("status", "APPROVED");
    try {
      await form.handleSubmit(handleSubmit)();
      setIsDialogOpen(false); // Close dialog after successful submission
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const handleReject = async () => {
    form.setValue("status", "REJECTED");
    try {
      await form.handleSubmit(handleSubmit)();
      setIsDialogOpen(false); // Close dialog after successful submission
    } catch (error) {
      console.error("Rejection failed:", error);
    }
  };

  return (

    <Card
    key={submission.id}
    className="border border-white/10 rounded-xl p-6 bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 group"
  >
    <CardContent className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="border border-primary-green w-[50px] h-[50px]">
            <AvatarImage
              width={50}
              height={50}
              src={user?.image as string}
              alt={`${user?.name}'s Avatar`}
            />
            <AvatarFallback
              className="text-white text-2xl"
              style={{
                backgroundColor: "oklch(0.9181 0.2323 126.72)",
              }}
            >
              {user?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h1 className="text-primary-green">
              {user?.name}
              <span className="text-gray-400 ml-1">submitted</span>
            </h1>
            <div className="flex gap-1 items-center">
              <Badge className="items-center border-primary-green mt-1">
                <span className="text-sm text-primary-green">
                  {item?.name}
                </span>
                <span className="text-xs text-gray-400">
                  {itemTypes(item?.type as string)}
                </span>
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <Badge
            className={cn(
              submission.status === "APPROVED" &&
                "bg-primary-green text-black",
              submission.status === "PENDING" && "bg-yellow-600",
              submission.status === "REJECTED" && "bg-red-600"
            )}
          >
            {submission.status.charAt(0).toUpperCase() +
              submission.status.slice(1).toLowerCase()}
          </Badge>
          <Badge>
            <span className="text-xs text-primary-green">
              {item?.points} Points
            </span>
          </Badge>
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex justify-between border-t-primary-green border-t-[1px] pt-4 items-center">
      <div className="flex gap-2">
        <span className="text-gray-400 gap-1 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Submitted:{" "}
          {new Date(submission.submittedAt).toLocaleDateString()}
        </span>
        <span className="text-gray-400 gap-1 flex items-center">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          Reviewed:{" "}
          {submission.reviewedAt
            ? new Date(submission.reviewedAt).toLocaleDateString()
            : "N/A"}
        </span>
      </div>
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                form.setValue("id", submission.id);
                setIsDialogOpen(true);
              }}
              disabled={
                submission.status === "REJECTED" ||
                submission.status === "APPROVED"
              }
              className="bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg transition-all duration-300"
            >
              {submission.status === "APPROVED" ||
              submission.status === "REJECTED" ? (
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
              <DialogTitle>Review Submission</DialogTitle>
              <DialogDescription>
                Review the evidence and approve or reject this item
                submission
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
                      <span className="text-sm text-gray-400">
                        User
                      </span>
                      <span className="text-primary-green">
                        {user.name}
                      </span>
                    </div>
                    <div className="flex justify-center flex-col space-y-2 ">
                      <span className="text-sm text-gray-400">
                        Item
                      </span>
                      <span className="text-primary-green">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex justify-center flex-col space-y-2 ">
                      <span className="text-sm text-gray-400">
                        Points
                      </span>
                      <span className="text-primary-green">
                        {item.points}
                      </span>
                    </div>
                    <div className="flex justify-center flex-col space-y-2 ">
                      <span className="text-sm text-gray-400">
                        Submitted
                      </span>
                      <span className="text-primary-green">
                        {new Date(
                          submission.submittedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm text-gray-400">
                      Evidence
                    </span>
                    <Link
                      href={submission.twitchClipUrl}
                      target="_blank"
                      className="text-primary-green"
                    >
                      {submission.twitchClipUrl.slice(0, 25)}...
                    </Link>
                  </div>
                  <FormField
                    control={form.control}
                    name="rejectionReason"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-400 text-xs items-start flex flex-col">
                          Rejection Reason
                          <span className="text-[10px] text-gray-400">
                            (Only add if you&apos;re rejecting
                            otherwise leave blank).
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
                      {updateMutation.isPending
                        ? "Rejecting..."
                        : "Reject"}
                    </Button>

                    <Button
                      type="button"
                      onClick={handleApprove}
                      className="bg-primary-green text-black transition-all duration-300 hover:bg-primary-green/60"
                      disabled={updateMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {updateMutation.isPending
                        ? "Approving..."
                        : "Approve"}
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
  )
}
