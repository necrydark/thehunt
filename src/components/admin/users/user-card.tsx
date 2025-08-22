"use client";

import { banUserSchema, userUpdateSchema } from "@/app/schemas/schema";
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
import { Submission, User, UserItem } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, CircleAlert, Clipboard } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type UserUpdateValues = z.infer<typeof userUpdateSchema>;
type BanUserValues = z.infer<typeof banUserSchema>;

type Props = {
  user: User & {
    userItems: UserItem[];
    submissions: Submission[];
  };
};

// Individual User Card Component to handle separate dialog states
export default function UserCard({ user }: Props) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);

  const utils = api.useUtils();

  const updateMutation = api.user.update.useMutation({
    onSuccess: async () => {
      toast("User Updated!");
      editForm.reset();
      setIsEditDialogOpen(false);
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
      banForm.reset();
      setIsBanDialogOpen(false);
      await utils.admin.getAllUsers.invalidate();
    },
    onError: (err) => {
      toast.error("Failed to ban user. Please try again");
      console.error("Ban error:", err);
    },
  });

  const editForm = useForm<UserUpdateValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      userId: user.id,
      role: user.role,
    },
  });

  const banForm = useForm<BanUserValues>({
    resolver: zodResolver(banUserSchema),
    defaultValues: {
      userId: user.id,
      banExpiresIn: new Date(),
      banReason: "",
    },
  });

  // Reset forms when user changes or dialogs open
  useEffect(() => {
    if (isEditDialogOpen) {
      editForm.reset({
        userId: user.id,
        role: user.role,
      });
    }
  }, [isEditDialogOpen, user.id, user.role, editForm]);

  useEffect(() => {
    if (isBanDialogOpen) {
      banForm.reset({
        userId: user.id,
        banExpiresIn: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
        banReason: "",
      });
    }
  }, [isBanDialogOpen, user.id, banForm]);

  const updateHandleSubmit = (data: UserUpdateValues) => {
    updateMutation.mutate({
      userId: data.userId,
      role: data.role,
    });
  };

  const banHandleSubmit = (data: BanUserValues) => {
    banMutation.mutate({
      userId: data.userId,
      banReason: data.banReason,
      banExpiresIn: data.banExpiresIn,
    });
  };

  return (
    <Card
      className={cn(
        user?.banned === true && "border-red-500",
        user?.banned === false && "border-white/10",
        "border rounded-xl p-6 gap-2 border-primary-green bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 group"
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
                  className="h-4 w-4 text-white cursor-pointer hover:text-primary-green transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(user?.id);
                    toast("User ID copied to clipboard");
                  }}
                />
              </h1>
              <span className=" text-primary-green text-xs">{user?.role}</span>
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
                          user.submissions.filter((s) => s.status === "PENDING")
                            .length
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
                        ? new Date(user.banExpire).toLocaleDateString()
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
        {/* Ban Dialog - Only show for non-banned users */}
        {!user.banned && (
          <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 cursor-pointer w-fit">
                Ban
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/20 backdrop-blur-lg border-primary-green">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Ban {user.name}
                </DialogTitle>
                <DialogDescription>
                  Ban this user from the website.
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
                        <FormLabel className="text-white">Ban Reason</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Reason for banning this user..."
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
                                  "w-[240px] pl-3 text-left font-normal border-primary-green bg-black text-white hover:bg-black/20 hover:text-white/75",
                                  !field.value && "text-muted-foreground"
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
                            className="w-auto p-0 bg-black border-primary-green"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                console.log(
                                  "Selected date:",
                                  date,
                                  typeof date
                                );
                                field.onChange(date);
                              }}
                              disabled={(date) => date < new Date()}
                              captionLayout="dropdown"
                              className="bg-black text-white"
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                      type="submit"
                      disabled={banMutation.isPending}
                    >
                      {banMutation.isPending ? "Banning..." : "Ban User"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-green hover:bg-primary-green/75 hover:shadow-md hover:shadow-primary-green/50 text-black font-semibold py-3 rounded-lg transition-all duration-300 cursor-pointer w-fit">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black backdrop-blur-lg border-primary-green">
            <DialogHeader>
              <DialogTitle className="text-white">
                Edit {user.name}&apos;s role
              </DialogTitle>
              <DialogDescription>
                Change this user&apos;s role.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form
                className="space-y-6"
                onSubmit={editForm.handleSubmit(updateHandleSubmit)}
              >
                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-primary-green text-white">
                            <SelectValue placeholder="Select the user's role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-primary-green">
                          <SelectItem
                            className="focus:bg-primary-green text-white focus:text-black active:bg-primary-green active:text-black"
                            value="Participant"
                          >
                            Participant
                          </SelectItem>
                          <SelectItem
                            className="focus:bg-primary-green text-white focus:text-black active:bg-primary-green active:text-black"
                            value="Reviewer"
                          >
                            Reviewer
                          </SelectItem>
                          <SelectItem
                            className="focus:bg-primary-green text-white focus:text-black active:bg-primary-green active:text-black"
                            value="Admin"
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
                    className="bg-primary-green hover:bg-primary-green/75 hover:shadow-md hover:shadow-primary-green/50 text-black font-semibold py-3 rounded-lg transition-all duration-300"
                    type="submit"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Updating..." : "Update Role"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
