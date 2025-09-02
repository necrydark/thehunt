"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/client";
import { useState } from "react";
import ClaimsCard from "./claims-card";

const ITEMS_PER_PAGE = 20;

export default function ClaimsTable() {
  const [page, setPage] = useState(0);

  const {
    data: claims,
    isLoading: claimsLoading,
    error: claimsError,
  } = api.bounty.getAllClaims.useQuery({
    limit: ITEMS_PER_PAGE,
    offset: page * ITEMS_PER_PAGE,
  });

  const {
    data: adminStats,
    isLoading: adminStatsLoading,
    error: adminStatsError,
  } = api.admin.getAllStats.useQuery();

  if (adminStatsLoading || claimsLoading) {
    return (
      <div className="relative mt-8">
        <div className="flex items-center flex-col space-y-8 justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
          <h1 className="mt-8 text-3xl text-primary-green">
            Loading Bounty Claims...
          </h1>
        </div>
      </div>
    );
  }

  if (adminStatsError || claimsError) {
    return (
      <div className=" relative">
        <div className="flex items-center justify-center">
          <div className="text-red-500">
            Error loading data:{" "}
            {adminStatsError?.message || claimsError?.message}
          </div>
        </div>
      </div>
    );
  }

  const getBountyClaimer = (userId: string) => {
    return adminStats?.users.find((u) => u.id === userId);
  };

  return (
    <div className="relative space-y-8 z-10">
      {claims && claims.length > 0 ? (
        <>
          {claims.map((claim) => {
            const claimer = getBountyClaimer(claim.claimedBy);
            if (!claimer) {
              return null;
            }

            return (
              <ClaimsCard
                key={claim.id}
                claimer={{
                  name: claimer.name,
                  image: claimer.image,
                  id: claimer.id,
                }}
                claim={{
                  ...claim,
                  claimedAt: new Date(claim.claimedAt),
                  updatedAt: new Date(claim.updatedAt),
                }}
              />
            );
          })}
          <div className="flex items-center justify-between pt-6">
            <Button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-black hover:opacity-90 bg-primary-green hover:bg-primary-green/75 "
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-primary-green">
                Page {page + 1}
              </span>
            </div>

            <Button
              onClick={() => setPage((p) => p + 1)}
              disabled={!claims || claims.length < ITEMS_PER_PAGE}
              className="text-black hover:opacity-90 bg-primary-green hover:bg-primary-green/75 "
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="pt-[5rem]">
          <h1 className="text-center text-3xl text-primary-green">
            There are currently no claims available.
          </h1>
        </div>
      )}
    </div>
  );
}
