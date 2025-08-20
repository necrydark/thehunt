"use client";

import {
  banUserSchema,
  unbanUserSchema,
  userUpdateSchema,
} from "@/app/schemas/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, CircleAlert, Clipboard } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const ITEMS_PER_PAGE = 20;
type UserUpdateValues = z.infer<typeof userUpdateSchema>;
type BanUserValues = z.infer<typeof banUserSchema>;
type UnbanUserValues = z.infer<typeof unbanUserSchema>;

export default function UsersTable() {
  const [page, setPage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
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

  const updateMutation = api.user.update.useMutation({
    onSuccess: async () => {
      toast("User Updated!");
      form.reset();
      setIsDialogOpen(false);

      await utils.admin.getAllUsers.invalidate();
    },
    onError: (err) => {
      toast.error("Failed to update user. Please try again");
      console.error("Update error:", err);
    },
  });
  const banMutation = api.admin.banUser.useMutation({
    onSuccess: async () => {
      toast("User Banned!");
      form.reset();
      setIsDialogOpen(false);

      await utils.admin.getAllUsers.invalidate();
    },
    onError: (err) => {
      toast.error("Failed to update user. Please try again");
      console.error("Update error:", err);
    },
  });

  const unbanMutation = api.admin.unbanUser.useMutation({
    onSuccess: async () => {
      toast("User Updated!");
      form.reset();
      setIsDialogOpen(false);

      await utils.admin.getAllUsers.invalidate();
    },
    onError: (err) => {
      toast.error("Failed to update user. Please try again");
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

  const banForm = useForm<BanUserValues>({
    resolver: zodResolver(banUserSchema),
    defaultValues: {
      userId: "",
      banExpiresIn: new Date(60 * 60 * 24 * 7),
      banReason: "",
    },
  });

  const unBanForm = useForm<UnbanUserValues>({
    resolver: zodResolver(unbanUserSchema),
    defaultValues: {
      userId: "",
    },
  });

  const updateHandleSubmit = (data: UserUpdateValues) => {
    updateMutation.mutate({
      userId: data.userId,
      role: data.role,
    });
  };

  const unbanHandleSubmit = (data: UnbanUserValues) => {
    unbanMutation.mutate({
      userId: data.userId,
    });
  };

  const banHandleSubmit = (data: BanUserValues) => {
    banMutation.mutate({
      userId: data.userId,
      banReason: data.banReason,
      banExpiresIn: data.banExpiresIn,
    });
  };

  // TODO: Add update for user details, ban form and unban form

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
              <Card
                key={user.id}
                className={cn(
                  user?.banned === true && "border-red-500",
                  user?.banned === false && "border-white/10",
                  "border rounded-xl p-6 bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 group"
                )}
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
                        <h1 className="text-primary-green flex gap-1 items-center">
                          {user?.name}
                          <Clipboard
                            className="h-4 w-4 text-white cursor-pointer "
                            onClick={() =>
                              navigator.clipboard.writeText(user?.id)
                            }
                          />
                        </h1>
                        <span className=" text-primary-green text-xs">
                          {user?.role}
                        </span>
                        <div className="flex gap-1 flex-wrap items-center mt-1">
                          <Badge className="items-center border-primary-green">
                            <span className=" text-gray-400">Joined: </span>
                            <span className=" text-primary-green">
                              {new Date(user?.createdAt).toLocaleDateString()}
                            </span>
                          </Badge>
                          <div className="flex gap-1 ">
                            <Badge className="border-primary-green text-gray-400">
                              Points{" "}
                              <span className="text-primary-green">
                                {user?.totalPoints}
                              </span>
                            </Badge>
                            <Badge className="border-primary-green text-gray-400">
                              Weapons{" "}
                              <span className="text-primary-green">
                                {user?.userItems.length}
                              </span>
                            </Badge>
                            <Badge className="border-primary-green text-gray-400">
                              Submissions{" "}
                              <span className="text-primary-green">
                                {user?.submissions.length}
                                <span className="text-yellow-400 ml-1 text-[10px]">
                                  (Pending{" "}
                                  {
                                    user.submissions.filter(
                                      (s) => s.status === "PENDING"
                                    ).length
                                  }
                                  )
                                </span>
                              </span>
                            </Badge>
                          </div>
                        </div>
                        {user.banned && (
                          <div className="mt-2">
                            <div className="flex gap-2">
                              <Badge variant={"destructive"}>BANNED</Badge>
                              <Badge variant={"destructive"}>
                                Expires:{" "}
                                {user?.banExpire
                                  ? new Date(
                                      user.banExpire
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </Badge>
                            </div>
                            <div className="p-2 bg-red-500 flex items-center gap-1 text-white text-sm mt-1 rounded-xl ">
                              <CircleAlert className="text-white w-4 h-4" />
                              {user?.banReason}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="flex justify-end gap-4">
                  {/* Ban Dialog */}
                  <Dialog
                    open={isBanDialogOpen}
                    onOpenChange={setIsBanDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <div className="flex justify-end">
                        <Button className="bg-primary-green hover:bg-primary-green/75 hover:shadow-md hover:shadow-primary-green/50 text-black font-semibold py-3 rounded-lg transition-all duration-300 cursor-pointer w-fit">
                          Ban
                        </Button>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="bg-black/20 backdrop-blur-lg border-primary-green">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Ban User
                        </DialogTitle>
                        <DialogDescription>
                          Ban a user from the website.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...banForm}>
                        <form
                          className="space-y-6"
                          onSubmit={banForm.handleSubmit(banHandleSubmit)}
                        >
                          <FormField
                            control={banForm.control}
                            name="banReason"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  Ban Reason
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="EWU-2831JDAK..."
                                    className="bg-black border-primary-green resize-none h-[100px] text-white focus-visible:ring-primary-green "
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={banForm.control}
                            name="banExpiresIn"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  Ban Expires
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-[240px] pl-3 text-left font-normal",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        date > new Date() ||
                                        date < new Date("1900-01-01")
                                      }
                                      captionLayout="dropdown"
                                    />
                                  </PopoverContent>
                                </Popover>
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
                  {/* Edit Dialog */}
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <div className="flex justify-end">
                        <Button className="bg-primary-green hover:bg-primary-green/75 hover:shadow-md hover:shadow-primary-green/50 text-black font-semibold py-3 rounded-lg transition-all duration-300 cursor-pointer w-fit">
                          Edit
                        </Button>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="bg-black backdrop-blur-lg border-primary-green">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Edit {user.name}&apos;s role
                        </DialogTitle>
                        <DialogDescription>
                          Change a users role.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          className="space-y-6"
                          onSubmit={form.handleSubmit(updateHandleSubmit)}
                        >
                          <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">
                                  Role
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className=" border-primary-green text-white">
                                      <SelectValue placeholder="Select the users role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-black border-primary-green">
                                    <SelectItem
                                      className="focus:bg-primary-green text-white foucs:text-black active:bg-primary-green active:text-black"
                                      value={"Participant"}
                                    >
                                      Participant
                                    </SelectItem>
                                    <SelectItem
                                      className="focus:bg-primary-green text-white foucs:text-black active:bg-primary-green active:text-black"
                                      value={"Reviewer"}
                                    >
                                      Reviewer
                                    </SelectItem>
                                    <SelectItem
                                      className="focus:bg-primary-green text-white foucs:text-black active:bg-primary-green active:text-black"
                                      value={"Admin"}
                                    >
                                      Admin
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end">
                            <Button
                              className=" bg-primary-green hover:bg-primary-green/75 hover:shadow-md hover:shadow-primary-green/50 text-black font-semibold py-3 rounded-lg transition-all duration-300"
                              type="submit"
                            >
                              Edit Role
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
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
