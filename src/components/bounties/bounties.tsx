"use client";

import { bountySchema } from "@/app/schemas/schema";
import { api } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { BountyCard } from "./bounty-card";

// All Bounties

type WeaponBountySubmissionValues = z.infer<typeof bountySchema>;

export default function Bounties() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const utils = api.useUtils();

  const bountyClaimMutation = api.bounty.claim.useMutation({
    onSuccess: async (createdClaim, variables) => {
      toast("Claim Submitted");
      utils.bounty.getAll.invalidate();

      try {
        await axios.post<{ success: boolean }>("/api/bounty-claim", {
          bountyId: variables.bountyId,
          twtichClipUrl: variables.twitchClipUrl,
          message: variables.message ?? "",
          mentionRole: true,
        });
      } catch (err) {
        console.error("Error sending message to Discord:", err);
      }
    },
    onError: (error) => {
      toast.error("Failed to submit claim. Please try again.");
      console.error("Submission error:", error);
    },
  });

  const bountyMutation = api.bounty.create.useMutation({
    onSuccess: async (createdBounty, variables) => {
      toast("Bounty Created");
      utils.bounty.getAll.invalidate();

      try {
        await axios.post<{ success: boolean }>("/api/discord-webhook", {
          title: variables.title,
          price: variables.price,
          description: variables.description ?? "",
          issuerName: createdBounty.issuer.name,
          mentionRole: true,
        });
      } catch (err) {
        console.error("Error sending message to Discord:", err);
      }
    },
    onError: (error) => {
      toast.error("Failed to submit bounty. Please try again.");
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
    data: bounties,
    isLoading: bountiesLoading,
    error: bountiesError,
  } = api.bounty.getAll.useQuery(
    {
      search: debouncedSearchQuery,
    },
    {
      placeholderData: (prev) => prev,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      enabled: true,
    }
  );

  const handleSubmit = useCallback(
    (bountyId: string, clipUrl: string, message?: string) => {
      bountyClaimMutation.mutate({
        bountyId,
        twitchClipUrl: clipUrl,
        message: message,
      });
    },
    [bountyClaimMutation]
  );

  // const handleSearchChange = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setSearchQuery(e.target.value);
  //   },
  //   []
  // );

  const bountyForm = useForm<WeaponBountySubmissionValues>({
    resolver: zodResolver(bountySchema),
    defaultValues: {
      price: 0,
      title: "",
      description: "",
    },
  });

  if (bountiesLoading) {
    return (
      <div>
        <h1 className="mt-8 text-3xl text-primary-green">
          Loading Bounties...
        </h1>
      </div>
    );
  }

  if (bountiesError) {
    return (
      <div className="min-h-screen w-full relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500">
            Error loading data: {bountiesError?.message}
          </div>
        </div>
      </div>
    );
  }

  const handleCreateBounty = (data: WeaponBountySubmissionValues) => {
    bountyMutation.mutate({
      title: data.title,
      price: data.price,
      description: data.description,
    });

    toast("Bounty Submitted.");
    bountyForm.reset();
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="flex justify-end items-center mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 text-black bg-primary-green hover:bg-primary-green/75 hover:opacity-90">
              Create Bounty
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-primary-green">
            <DialogHeader className="text-white">Create A Bounty</DialogHeader>
            <DialogDescription>Create a community bounty.</DialogDescription>
            <div className="space-y-4">
              <Form {...bountyForm}>
                <form
                  className="space-y-6"
                  onSubmit={bountyForm.handleSubmit(handleCreateBounty)}
                >
                  <div className="flex gap-4 items-center">
                    <FormField
                      control={bountyForm.control}
                      name="title"
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
                    disabled={bountyMutation.isPending}
                  >
                    {bountyMutation.isPending ? "Submitting..." : "Submit"}
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        {bounties && bounties.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2 justify-items-center">
            {bounties?.map((bounty) => (
              <BountyCard
                key={bounty.id}
                onSubmit={handleSubmit}
                bounty={{
                  ...bounty,
                  createdAt: new Date(bounty.createdAt),
                  updatedAt: new Date(bounty.updatedAt),
                }}
                isSubmitting={false}
              />
            ))}
          </div>
        ) : (
          <div>
            <h1 className="text-white text-3xl leading-tight text-center mt-8 font-bold">
              There are no bounties currently availble. Get started by creating
              your own bounty, or check again later.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
