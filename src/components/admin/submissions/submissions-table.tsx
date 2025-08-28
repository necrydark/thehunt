"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/client";
import { useState } from "react";
import SubmissionCard from "./submissions-card";

const ITEMS_PER_PAGE = 20;

export default function SubmissionsTable() {
  const [page, setPage] = useState(0);

  const {
    data: submissions,
    isLoading: submissionsLoading,
    error: submissionsError,
  } = api.submission.getAll.useQuery({
    limit: ITEMS_PER_PAGE,
    offset: page * ITEMS_PER_PAGE,
  });

  const {
    data: adminStats,
    isLoading: adminStatsLoading,
    error: adminStatsError,
  } = api.admin.getAllStats.useQuery();

  if (adminStatsLoading || submissionsLoading) {
    return (
      <div className="relative mt-8">
        <div className="flex items-center flex-col space-y-8 justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
          <h1 className="mt-8 text-3xl text-primary-green">
            Loading Submissions...
          </h1>
        </div>
      </div>
    );
  }

  if (adminStatsError || submissionsError) {
    return (
      <div className=" relative">
        <div className="flex items-center justify-center">
          <div className="text-red-500">
            Error loading data:{" "}
            {adminStatsError?.message || submissionsError?.message}
          </div>
        </div>
      </div>
    );
  }

  const getSubmissionUser = (userId: string) => {
    return adminStats?.users.find((u) => u.id === userId);
  };

  const getSubmissionItem = (itemId: string) => {
    return adminStats?.items.find((i) => i.id === itemId);
  };

  console.log(submissions);

  return (
    <div className="relative space-y-8 z-10">
      {submissions && submissions.length > 0 ? (
        <>
          {submissions.map((submission) => {
            const user = getSubmissionUser(submission.userId);
            const item = getSubmissionItem(submission.itemId);
            if (!user || !item) {
              return null;
            }
            return (
              <SubmissionCard
                key={submission.id}
                item={{
                  ...item,
                  createdAt: new Date(item.createdAt),
                  updatedAt: new Date(item.updatedAt),
                }}
                user={{
                  ...user,
                  createdAt: new Date(user.createdAt),
                  updatedAt: new Date(user.updatedAt),
                  banExpire: user.banExpire ? new Date(user.banExpire) : null,
                }}
                submission={{
                  ...submission,
                  submittedAt: new Date(submission.submittedAt),
                  reviewedAt: submission.reviewedAt
                    ? new Date(submission.reviewedAt)
                    : null,
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
              disabled={!submissions || submissions.length < ITEMS_PER_PAGE}
              className="text-black hover:opacity-90 bg-primary-green hover:bg-primary-green/75 "
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="pt-[5rem]">
          <h1 className="text-center text-primary-green">
            There are currently no user submissions available.
          </h1>
        </div>
      )}
    </div>
  );
}
