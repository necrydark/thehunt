"use client";

import { unbanUserSchema, userUpdateSchema } from "@/app/schemas/schema";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { api } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import UserCard from "./user-card";

const ITEMS_PER_PAGE = 20;
type UserUpdateValues = z.infer<typeof userUpdateSchema>;
type UnbanUserValues = z.infer<typeof unbanUserSchema>;

export default function UsersTable() {
  const [page, setPage] = useState(0);
  const [isUnBanDialogOpen, setIsUnBanDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const utils = api.useUtils();

  // const updateMutation = api.submission.review.useMutation({
  //   onSuccess: async () => {
  //     toast("Review Submitted");
  //     form.reset();
  //     setIsDialogOpen(false);

  //     await utils.submission.getAll.invalidate();
  //   },
  //   onError: (err) => {
  //     toast.error("Failed to submit evidence. Please try again");
  //     console.error("Submission error:", err);
  //   },
  // });

  const unbanMutation = api.admin.unbanUser.useMutation({
    onSuccess: async () => {
      toast("User unbanned!");
      form.reset();
      setIsUnBanDialogOpen(false);

      await utils.admin.getAllUsers.invalidate();
    },
    onError: (err) => {
      toast.error("Failed to unban user. Please try again");
      console.error("Update error:", err);
    },
  });

  const {
    data: users,
    isLoading: adminUsersLoading,
    error: adminUsersError,
  } = api.admin.getAllUsers.useQuery({
    name: searchQuery,
    limit: ITEMS_PER_PAGE,
    offset: page * ITEMS_PER_PAGE,
  });

  const form = useForm<UserUpdateValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      userId: "",
      role: "Participant",
    },
  });

  const unBanForm = useForm<UnbanUserValues>({
    resolver: zodResolver(unbanUserSchema),
    defaultValues: {
      userId: "",
    },
  });

  const unbanHandleSubmit = (data: UnbanUserValues) => {
    unbanMutation.mutate({
      userId: data.userId,
    });
  };

  if (adminUsersLoading) {
    return (
      <div className="relative mt-8">
        <div className="flex items-center flex-col space-y-8 justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
          <h1 className="mt-8 text-3xl text-primary-green">Loading Users...</h1>
        </div>
      </div>
    );
  }

  if (adminUsersError) {
    return (
      <div className=" relative">
        <div className="flex items-center justify-center">
          <div className="text-red-500">
            Error loading data: {adminUsersError?.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 z-10">
      {users && users.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user..."
              className="max-w-[400px] border-primary-green placeholder:text-white focus-visible:ring-0 focus-visible:border-primary-green text-primary-green"
            />
            <Dialog
              open={isUnBanDialogOpen}
              onOpenChange={setIsUnBanDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className=" bg-primary-green hover:bg-primary-green/75 hover:shadow-md hover:shadow-primary-green/50 text-black font-semibold py-3 rounded-lg transition-all duration-300">
                  Unban
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/20 backdrop-blur-lg border-primary-green">
                <DialogHeader>
                  <DialogTitle className="text-white">Unban User</DialogTitle>
                  <DialogDescription>
                    Unban a user from the website.
                  </DialogDescription>
                </DialogHeader>
                <Form {...unBanForm}>
                  <form
                    className="space-y-6"
                    onSubmit={unBanForm.handleSubmit(unbanHandleSubmit)}
                  >
                    <FormField
                      control={unBanForm.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">User ID</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="EWU-2831JDAK..."
                              className="bg-black border-primary-green text-white focus-visible:ring-primary-green "
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button
                        className=" bg-primary-green hover:bg-primary-green/75 hover:shadow-md hover:shadow-primary-green/50 text-black font-semibold py-3 rounded-lg transition-all duration-300"
                        type="submit"
                      >
                        Submit Unban
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          {users.map((user) => {
            return (
              <UserCard
                key={user.id}
                user={{
                  ...user,
                  email: user.email ?? "",
                  emailVerified: user.emailVerified ?? false,
                  createdAt:
                    typeof user.createdAt === "string"
                      ? new Date(user.createdAt)
                      : user.createdAt,
                  banExpire: user.banExpire
                    ? typeof user.banExpire === "string"
                      ? new Date(user.banExpire)
                      : user.banExpire
                    : null,
                  updatedAt:
                    typeof user.updatedAt === "string"
                      ? new Date(user.updatedAt)
                      : user.updatedAt,
                  role: user.role as string,
                  image: user.image,
                  name: user.name,
                  totalPoints: user.totalPoints,
                  banned: user.banned,
                  banReason: user.banReason,
                  userItems:
                    user?.userItems?.map((item) => ({
                      ...item,
                      obtainedAt:
                        typeof item.obtainedAt === "string"
                          ? new Date(item.obtainedAt)
                          : item.obtainedAt,
                    })) ?? [],
                  submissions:
                    user.submissions?.map((submission) => ({
                      ...submission,
                      submittedAt:
                        typeof submission.submittedAt === "string"
                          ? new Date(submission.submittedAt)
                          : submission.submittedAt,
                      reviewedAt: submission.reviewedAt
                        ? typeof submission.reviewedAt === "string"
                          ? new Date(submission.reviewedAt)
                          : submission.reviewedAt
                        : null,
                    })) ?? [],
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
              disabled={!users || users.length < ITEMS_PER_PAGE}
              className="text-black hover:opacity-90 bg-primary-green hover:bg-primary-green/75 "
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="pt-[5rem]">
          <h1 className="text-center text-primary-green">
            There are currently no users available.
          </h1>
        </div>
      )}
    </div>
  );
}
