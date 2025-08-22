"use client";

import { itemSchema } from "@/app/schemas/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  itemRarity,
  itemTypes,
  rarityColors,
  typeIcons,
} from "@/lib/item-changes";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
// import { format } from "date-fns";
import { Clipboard, Edit, Loader2, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type ItemUpdateValues = z.infer<typeof itemSchema>;

type Props = {
  item: Item;
};

// Individual User Card Component to handle separate dialog states
export default function ItemCard({ item }: Props) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const utils = api.useUtils();

  const updateMutation = api.item.update.useMutation({
    onSuccess: async () => {
      toast("Item Updated!");
      editForm.reset();
      setIsEditDialogOpen(false);
      await utils.item.getAll.invalidate();
    },
    onError: (err) => {
      toast.error("Failed to update item. Please try again");
      console.error("Update error:", err);
    },
  });

  const deleteMutation = api.item.delete.useMutation({
    onSuccess: async () => {
      toast("Item deleted successfully!");
      setIsDeleteDialogOpen(false);
      await utils.item.getAll.invalidate();
    },
    onError: (err) => {
      toast.error("Failed to delete item. Please try again");
      console.error("Delete error:", err);
    },
  });

  const editForm = useForm<ItemUpdateValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      id: item.id,
      name: item.name,
      points: item.points,
      mayhem: item.mayhem,
      listGroup: item.listGroup,
      type: item.type,
      source: item.source,
      maps: item.maps,
      missionType: item.missionType,
      rarity: item.rarity,
      notes: item.notes ?? "",
    },
  });

  // Reset forms when user changes or dialogs open
  useEffect(() => {
    if (isEditDialogOpen) {
      editForm.reset({
        id: item.id,
        name: item.name,
        points: item.points,
        mayhem: item.mayhem,
        listGroup: item.listGroup,
        type: item.type,
        source: item.source,
        maps: item.maps,
        missionType: item.missionType,
        rarity: item.rarity,
        notes: item.notes ?? "",
      });
    }
  }, [isEditDialogOpen, item, editForm]);

  const handleDelete = () => {
    deleteMutation.mutate({ id: item.id });
  };

  const updateHandleSubmit = (data: ItemUpdateValues) => {
    updateMutation.mutate({
      id: data.id as string,
      ...data,
    });
  };

  console.log(item);

  return (
    <Card
      className={cn(
        "border rounded-xl p-6 gap-2 border-primary-green bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 group"
      )}
    >
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-primary-green text-xl flex gap-1 items-center">
                <span>{typeIcons[itemTypes(item.type)]}</span>
                {item.name}
                <Clipboard
                  className="h-4 w-4 text-white cursor-pointer hover:text-primary-green transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(item.name);
                    toast("item name copied to clipboard");
                  }}
                />
              </h1>
              <span className=" text-primary-green text-sm">
                {itemTypes(item.type)}
              </span>
              <div className="flex gap-1 flex-wrap items-center mt-1">
                <Badge
                  className={`${
                    rarityColors[item.rarity]
                  } text-white capitalize`}
                >
                  {itemRarity(item.rarity)}
                </Badge>
                <div className="flex gap-1 ">
                  <Badge className="border-primary-green text-gray-400">
                    Points{" "}
                    <span className="text-primary-green">{item.points}</span>
                  </Badge>
                </div>
                <div className="flex gap-1 ">
                  <Badge className="border-primary-green text-gray-400">
                    Source{" "}
                    <span className="text-primary-green">{item.source}</span>
                  </Badge>
                </div>
                <div className="flex gap-1 ">
                  <Badge className="border-primary-green text-gray-400">
                    Maps <span className="text-primary-green">{item.maps}</span>
                  </Badge>
                </div>
                <div className="flex gap-1 ">
                  <Badge className="border-primary-green text-gray-400">
                    Group{" "}
                    <span className="text-primary-green">{item.listGroup}</span>
                  </Badge>
                </div>
                <div className="flex gap-1 ">
                  <Badge className="border-primary-green text-gray-400">
                    Type{" "}
                    <span className="text-primary-green">
                      {item.missionType}
                    </span>
                  </Badge>
                </div>
                <div className="flex gap-1 ">
                  <Badge className="border-primary-green text-gray-400">
                    Mayhem{" "}
                    <span className="text-primary-green">{item.mayhem}</span>
                  </Badge>
                </div>
              </div>
              {item.notes && (
                <div className="bg-black/50 my-4 p-2 text-white rounded-md">
                  <span>Notes:</span>
                  <p className="text-xs">{item.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <div className="flex justify-end gap-4">
        {/* Delete Item */}

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/20 backdrop-blur-lg border-primary-green">
            <DialogHeader>
              <DialogTitle className="text-white">
                Delete {item.name}
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Are you sure you want to delete &quot;{item.name}&quot;? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-black text-white hover:text-white/75 hover:bg-black"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Item"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Item Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-green hover:bg-primary-green/75 hover:shadow-md hover:shadow-primary-green/50 text-black font-semibold py-3 rounded-lg transition-all duration-300 cursor-pointer w-fit">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/20 backdrop-blur-lg border-primary-green max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Edit {item.name}</DialogTitle>
              <DialogDescription className="text-gray-300">
                Update the item information below.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form
                className="space-y-4"
                onSubmit={editForm.handleSubmit(updateHandleSubmit)}
              >
                {/* Name Field */}
                <FormField
                  control={editForm.control}
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
                    control={editForm.control}
                    name="points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Points</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="border-primary-green bg-black/50 text-white focus-visible:ring-0 focus-visible:border-primary-green autofill:bg-black/50"
                            placeholder="0"
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
                    control={editForm.control}
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
                    control={editForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-primary-green bg-black/50 text-white">
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
                    control={editForm.control}
                    name="rarity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Rarity</FormLabel>
                        <FormControl>
                          <Input
                            min={1}
                            max={5}
                            type="number"
                            className="border-primary-green bg-black/50 text-white focus-visible:ring-0 focus-visible:border-primary-green autofill:bg-black/50"
                            {...field}
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
                    control={editForm.control}
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
                    control={editForm.control}
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
                    control={editForm.control}
                    name="listGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">List Group</FormLabel>
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
                    control={editForm.control}
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
                  control={editForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          className="border-primary-green bg-black/50 text-white focus-visible:ring-0 focus-visible:border-primary-green autofill:bg-black/50 resize-none"
                          placeholder="Additional notes..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="bg-black text-white hover:text-white/75 hover:bg-black"
                    disabled={updateMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary-green hover:bg-primary-green/75 hover:shadow-md hover:shadow-primary-green/50 text-black font-semibold py-3 rounded-lg transition-all duration-300"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Item"
                    )}
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
