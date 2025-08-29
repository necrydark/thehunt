"use client";

import { api } from "@/lib/trpc/client";
import { Calendar, User2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

// All Bounties
export default function Bounties() {
  const [searchQuery, setSearchQuery] = useState("");

  const utils = api.useUtils();

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
      <div className="flex flex-wrap justify-evenly gap-4">
        {bounties && bounties.length > 0 ? (
          <>
            {bounties?.map((bounty) => (
              <Card
                key={bounty.id}
                className="bg-black/20 border-white/10 relative text-white "
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <span className="text-2xl">{bounty.title}</span>
                      </CardTitle>
                      <CardDescription className="text-gray-300 flex items-center gap-1 mt-2">
                        <Avatar>
                          <AvatarImage
                            src={bounty.issuer.image || ""}
                            alt={bounty.issuer.name}
                          />
                          <AvatarFallback className="bg-background text-primary-green-foreground">
                            <User2 />
                          </AvatarFallback>
                        </Avatar>
                        {bounty.issuer.name}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className={`text-white border-primary-green bg-black/50 absolute top-4 right-4 capitalize`}
                      >
                        {bounty.status}
                      </Badge>
                      {/* {weapon.userItemStatus && (
                      <Badge
                        variant={
                          weapon.userItemStatus === "Approved"
                            ? "default"
                            : weapon.userItemStatus === "Pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {weapon.userItemStatus === "Approved" && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {weapon.userItemStatus === "Pending" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {weapon.userItemStatus === "Rejected" && (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {weapon.userItemStatus}
                      </Badge>
                    )} */}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2 text-sm">
                    <div>
                      <span>Price:</span>
                      <span className="ml-2 font-semibold text-yellow-400">
                        ${bounty.price}
                      </span>
                    </div>
                    <div>
                      <span>Item:</span>
                      <span className="ml-2 font-semibold text-yellow-400">
                        {bounty.item.name}
                      </span>
                    </div>
                    <div>
                      <span>Source:</span>
                      <span className="ml-2 font-semibold text-yellow-400">
                        {bounty.item.source}
                      </span>
                    </div>
                    <div>
                      <span>Mission:</span>
                      <span className="ml-2 font-semibold text-yellow-400">
                        {bounty.item.missionType}
                      </span>
                    </div>
                    <div>
                      <span>Maps:</span>
                      <span className="ml-2 font-semibold text-yellow-400">
                        {bounty.item.maps}
                      </span>
                    </div>
                    {bounty.description && (
                      <div>
                        <span>Description:</span>
                        <span className="ml-2 font-semibold ">
                          {bounty.description}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="w-full flex-1">
                  <div className="flex gap-2 mt-2 w-full justify-between">
                    <div className="flex gap-1 items-center">
                      <Calendar className="w-4 h-4 text-primary-green" />
                      <span className=" text-muted-foreground">
                        Issue Date:{" "}
                        {new Date(bounty.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <Button className="bg-primary-green hover:bg-primary-green/75 text-black hover:text-black">
                        Claim
                      </Button>
                    </div>
                    {/* 
                  <Dialog
                    open={isBountyDialogOpen}
                    onOpenChange={setIsBountyDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            className=" mt-4 shrink-0 text-primary-green border-[1px] bg-black hover:bg-black/75 border-primary-green hover:opacity-90"
                            size={"icon"}
                            onClick={handleBountyDialogOpen}
                          >
                            <Plus className=" h-4 w-4" />
                          </Button>
                          <TooltipContent>
                            <p>Create Bounty for {weapon.name}</p>
                          </TooltipContent>
                        </TooltipTrigger>
                      </Tooltip>
                    </DialogTrigger>
                    <DialogContent className="bg-black border-primary-green">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Create a bounty for {weapon.name}
                        </DialogTitle>
                        <DialogDescription className="text-white">
                          Create a community bounty.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Form {...bountyForm}>
                          <form
                            className="space-y-6"
                            onSubmit={bountyForm.handleSubmit(handleBountySubmit)}
                          >
                            <div className="flex gap-4 items-center">
                              <FormField
                                control={bountyForm.control}
                                name="name"
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
                                    <FormLabel className="text-white">
                                      Price
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
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
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                          </form>
                        </Form>
                      </div>
                    </DialogContent>
                  </Dialog> */}
                  </div>
                </CardFooter>
              </Card>
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
