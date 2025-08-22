"use client";

import { itemSchema } from "@/app/schemas/schema";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import ItemCard from "./item-card";

const ITEMS_PER_PAGE = 20;
type ItemCreateValues = z.infer<typeof itemSchema>;

export default function ItemsTable() {
  const [page, setPage] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const utils = api.useUtils();

  const createMutation = api.item.create.useMutation({
    onSuccess: async () => {
      toast("Item Created!");
      createForm.reset();
      setIsCreateDialogOpen(false);

      await utils.item.getAll.invalidate();
    },
    onError: (err) => {
      toast.error("Failed to create item. Please try again");
      console.error("Update error:", err);
    },
  });

  const {
    data: items,
    isLoading: itemsLoading,
    error: itemsError,
  } = api.item.getAll.useQuery({
    search: searchQuery,
    limit: ITEMS_PER_PAGE,
    offset: page * ITEMS_PER_PAGE,
  });

  const createForm = useForm<ItemCreateValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      points: 1,
      mayhem: "",
      listGroup: "",
      type: "",
      source: "",
      maps: "",
      missionType: "",
      rarity: 1,
      notes: "",
    },
  });

  const createHandleSubmit = (data: ItemCreateValues) => {
    console.log("Form submitted with data:", data);
    console.log("Form is valid:", createForm.formState.isValid);
    console.log("Form errors:", createForm.formState.errors);
    createMutation.mutate({
      ...data,
    });
  };

  if (itemsLoading) {
    return (
      <div className="relative mt-8">
        <div className="flex items-center flex-col space-y-8 justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green" />
          <h1 className="mt-8 text-3xl text-primary-green">Loading Items...</h1>
        </div>
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className=" relative">
        <div className="flex items-center justify-center">
          <div className="text-red-500">
            Error loading data: {itemsError?.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 z-10">
      {items && items.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search item..."
              className="max-w-[400px] border-primary-green placeholder:text-white focus-visible:ring-0 focus-visible:border-primary-green text-primary-green"
            />
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className=" bg-primary-green hover:bg-primary-green/75 hover:shadow-md hover:shadow-primary-green/50 text-black font-semibold py-3 rounded-lg transition-all duration-300">
                  <Plus className="h-4 w-4" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/20 backdrop-blur-lg border-primary-green">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Item Creation
                  </DialogTitle>
                  <DialogDescription>Create an item.</DialogDescription>
                </DialogHeader>
                <Form {...createForm}>
                  <form
                    className="space-y-6"
                    onSubmit={createForm.handleSubmit(createHandleSubmit)}
                  >
                    {/* Name Field */}
                    <FormField
                      control={createForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Name</FormLabel>
                          <FormControl>
                            <Input
                              className="border-primary-green bg-black/50 text-white focus-visible:ring-0 focus-visible:border-primary-green autofill:bg-black/50"
                              placeholder="Item name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Points and Mayhem - Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="points"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Points</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                className="border-primary-green bg-black/50 text-white focus-visible:ring-0 focus-visible:border-primary-green autofill:bg-black/50"
                                placeholder="1"
                                min={1}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="mayhem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Mayhem</FormLabel>
                            <FormControl>
                              <Input
                                className="border-primary-green bg-black/50 text-white focus-visible:ring-0 focus-visible:border-primary-green autofill:bg-black/50"
                                placeholder="0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Type and Rarity - Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-primary-green bg-black/50 text-white  focus-visible:ring-0 focus-visible:border-primary-green">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-black border-primary-green">
                                <SelectItem
                                  className="text-white hover:bg-primary-green hover:text-black"
                                  value="PSTL"
                                >
                                  Pistol
                                </SelectItem>
                                <SelectItem
                                  className="text-white hover:bg-primary-green hover:text-black"
                                  value="SHLD"
                                >
                                  Shield
                                </SelectItem>
                                <SelectItem
                                  className="text-white hover:bg-primary-green hover:text-black"
                                  value="GRND"
                                >
                                  Grenade
                                </SelectItem>
                                <SelectItem
                                  className="text-white hover:bg-primary-green hover:text-black"
                                  value="COM"
                                >
                                  Class Mod
                                </SelectItem>
                                <SelectItem
                                  className="text-white hover:bg-primary-green hover:text-black"
                                  value="AR"
                                >
                                  Assault Rifle
                                </SelectItem>
                                <SelectItem
                                  className="text-white hover:bg-primary-green hover:text-black"
                                  value="SNPR"
                                >
                                  Sniper
                                </SelectItem>
                                <SelectItem
                                  className="text-white hover:bg-primary-green hover:text-black"
                                  value="SHTGN"
                                >
                                  Shotgun
                                </SelectItem>
                                <SelectItem
                                  className="text-white hover:bg-primary-green hover:text-black"
                                  value="SMG"
                                >
                                  SMG
                                </SelectItem>
                                <SelectItem
                                  className="text-white hover:bg-primary-green hover:text-black"
                                  value="LNCHR"
                                >
                                  Launcher
                                </SelectItem>
                                <SelectItem
                                  className="text-white hover:bg-primary-green hover:text-black"
                                  value="ARTF"
                                >
                                  Artifact
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="rarity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Rarity</FormLabel>
                            <FormControl>
                              <Input
                                min={1}
                                max={5}
                                type="number"
                                className="border-primary-green bg-black/50 text-white focus-visible:ring-0 focus-visible:border-primary-green autofill:bg-black/50 "
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Source and Maps - Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="source"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Source</FormLabel>
                            <FormControl>
                              <Input
                                className="border-primary-green bg-black/50 text-white focus-visible:ring-0 focus-visible:border-primary-green autofill:bg-black/50"
                                placeholder="Item source"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="maps"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Maps</FormLabel>
                            <FormControl>
                              <Input
                                className="border-primary-green bg-black/50 text-white focus-visible:ring-0 focus-visible:border-primary-green autofill:bg-black/50"
                                placeholder="Available maps"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* List Group and Mission Type - Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="listGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              List Group
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="border-primary-green bg-black/50 text-white focus-visible:ring-0 focus-visible:border-primary-green autofill:bg-black/50"
                                placeholder="Group classification"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="missionType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Mission Type
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="border-primary-green bg-black/50 text-white focus-visible:ring-0 focus-visible:border-primary-green autofill:bg-black/50"
                                placeholder="Mission type"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Notes Field */}
                    <FormField
                      control={createForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              className="border-primary-green bg-black/50 resize-none text-white focus-visible:ring-0 focus-visible:border-primary-green autofill:bg-black/50"
                              placeholder="Additional notes..."
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="bg-black text-white hover:text-white/75 hover:bg-black"
                        disabled={createMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        className=" bg-primary-green hover:bg-primary-green/75 hover:shadow-md hover:shadow-primary-green/50 text-black font-semibold py-3 rounded-lg transition-all duration-300"
                        type="submit"
                      >
                        {createMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Item"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          {items?.map((item) => {
            return (
              <ItemCard
                key={item.id}
                item={{
                  ...item,
                  createdAt:
                    typeof item.createdAt === "string"
                      ? new Date(item.createdAt)
                      : item.createdAt,
                  updatedAt:
                    typeof item.updatedAt === "string"
                      ? new Date(item.updatedAt)
                      : item.updatedAt,
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
              disabled={!items || items.length < ITEMS_PER_PAGE}
              className="text-black hover:opacity-90 bg-primary-green hover:bg-primary-green/75 "
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="pt-[5rem]">
          <h1 className="text-center text-primary-green">
            There are currently no items available.
          </h1>
        </div>
      )}
    </div>
  );
}
