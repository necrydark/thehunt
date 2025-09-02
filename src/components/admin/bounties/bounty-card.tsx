"use client";
import { bountyReview } from "@/app/schemas/schema";
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
import { Form } from "@/components/ui/form";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bounty } from "@prisma/client";
import { Calendar, CheckCircle, Eye, XCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type Props = {
  issuer: {
    id: string;
    name: string;
    image: string | null;
  };
  bounty: Bounty;
};

type SubmissionValues = z.infer<typeof bountyReview>;

export default function BountyCard({ issuer, bounty }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const utils = api.useUtils();

  const updateMutation = api.bounty.reviewBounty.useMutation({
    onSuccess: async () => {
      toast("Bounty Reviewed");
      form.reset();
      setIsDialogOpen(false);

      await utils.bounty.getAll.invalidate();
    },
    onError: (err) => {
      toast.error("Failed to submit review. Please try again");
      console.error("Submission error:", err);
    },
  });

  const form = useForm<SubmissionValues>({
    resolver: zodResolver(bountyReview),
    defaultValues: {
      id: "",
      status: "CANCELLED",
    },
  });

  const handleSubmit = (data: SubmissionValues) => {
    updateMutation.mutate({
      id: data.id,
      status: data.status,
    });
  };

  const handleOpen = async () => {
    form.setValue("status", "OPEN");
    try {
      await form.handleSubmit(handleSubmit)();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Open failed:", error);
    }
  };

  const handleCancel = async () => {
    form.setValue("status", "CANCELLED");
    try {
      await form.handleSubmit(handleSubmit)();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Cancelled failed:", error);
    }
  };

  return (
    <Card
      key={bounty.id}
      className="border border-white/10 rounded-xl p-6 bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 group"
    >
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="border border-primary-green w-[50px] h-[50px]">
              <AvatarImage
                width={50}
                height={50}
                src={issuer?.image as string}
                alt={`${issuer?.name}'s Avatar`}
              />
              <AvatarFallback
                className="text-white text-2xl"
                style={{
                  backgroundColor: "oklch(0.9181 0.2323 126.72)",
                }}
              >
                {issuer?.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h1 className="text-primary-green">
                {issuer?.name}
                <span className="text-gray-400 ml-1">submitted</span>
              </h1>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Badge
              className={cn(
                bounty.status === "OPEN" && "bg-primary-green text-black",
                bounty.status === "PENDING" && "bg-yellow-600",
                bounty.status === "CANCELLED" && "bg-red-600",
                bounty.status === "EXPIRED" && "bg-red-600",
                bounty.status === "COMPLETED" && "bg-green-600"
              )}
            >
              {bounty.status.charAt(0).toUpperCase() +
                bounty.status.slice(1).toLowerCase()}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t-primary-green border-t-[1px] pt-4 items-center">
        <div className="flex gap-2">
          <span className="text-gray-400 gap-1 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Submitted: {new Date(bounty.createdAt).toLocaleDateString()}
          </span>
          <span className="text-gray-400 gap-1 flex items-center">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            Reviewed:{" "}
            {bounty.updatedAt
              ? new Date(bounty.updatedAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  form.setValue("id", bounty.id);
                  setIsDialogOpen(true);
                }}
                disabled={
                  bounty.status === "CANCELLED" ||
                  bounty.status === "OPEN" ||
                  bounty.status === "CLAIMED" ||
                  bounty.status === "COMPLETED" ||
                  bounty.status === "EXPIRED"
                }
                className="bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg transition-all duration-300"
              >
                {bounty.status === "OPEN" ||
                bounty.status === "CANCELLED" ||
                bounty.status === "CLAIMED" ||
                bounty.status === "COMPLETED" ||
                bounty.status === "EXPIRED" ? (
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
                <DialogTitle>Review Bounty</DialogTitle>
                <DialogDescription>
                  Review the bounty created to create or reject the bounty.
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
                        <span className="text-sm text-gray-400">Issuer</span>
                        <span className="text-primary-green">
                          {issuer.name}
                        </span>
                      </div>

                      <div className="flex justify-center flex-col space-y-2 ">
                        <span className="text-sm text-gray-400">Title</span>
                        <span className="text-primary-green">
                          {bounty.title}
                        </span>
                      </div>
                      <div className="flex justify-center flex-col space-y-2 ">
                        <span className="text-sm text-gray-400">Price</span>
                        <span className="text-primary-green">
                          {bounty.price}
                        </span>
                      </div>
                      <div className="flex justify-center flex-col space-y-2 ">
                        <span className="text-sm text-gray-400">
                          Description
                        </span>
                        <span className="text-primary-green">
                          {bounty.description}
                        </span>
                      </div>

                      <div className="flex justify-center flex-col space-y-2 ">
                        <span className="text-sm text-gray-400">Submitted</span>
                        <span className="text-primary-green">
                          {new Date(bounty.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        onClick={handleCancel}
                        className="bg-red-500 text-white transition-all duration-300 hover:bg-red-500/60"
                        disabled={updateMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        {updateMutation.isPending ? "Cancelling..." : "Cancel"}
                      </Button>

                      <Button
                        type="button"
                        onClick={handleOpen}
                        className="bg-primary-green text-black transition-all duration-300 hover:bg-primary-green/60"
                        disabled={updateMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {updateMutation.isPending ? "Opening..." : "Open"}
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
