"use client";

import { api } from "@/lib/trpc/client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { BountyCard } from "./bounty-card";

// All Bounties
export default function Bounties() {
  const [searchQuery, setSearchQuery] = useState("");

  const utils = api.useUtils();

  const bountyClaimMutation = api.bounty.claim.useMutation({
    onSuccess: async () => {
      toast("Claim Submitted");
      utils.bounty.getAll.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to submit claim. Please try again.");
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

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

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

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-2 justify-items-center">
        {bounties && bounties.length > 0 ? (
          <>
            {bounties?.map((bounty) => (
              <BountyCard
                key={bounty.id}
                onSubmit={handleSubmit}
                bounty={{
                  ...bounty,
                  createdAt: new Date(bounty.createdAt),
                  updatedAt: new Date(bounty.updatedAt),
                }}
                // onSubmit={()}
                isSubmitting={false}
              />
            ))}
          </>
        ) : (
          <div>
            <h1 className="text-white text-3xl leading-tight font-bold">
              There are no bounties currently availble, please check again later
              or wait for a ping in Discord.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
