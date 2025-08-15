"use client";
import { User } from "@prisma/client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ProfileCollection from "./profile-collection";
import ProfileOverview from "./profile-overview";
import ProfileStats from "./profile-stats";

type Props = {
  user: User & {
    role?: string;
    totalPoints?: number;
  };
};

export default function ProfileTabs({ user }: Props) {
  const [currentTab, setCurrentTab] = useState("overview");

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <TabsList className=" h-full grid grid-cols-3 w-full mb-6 bg-primary-green text-white">
        <TabsTrigger
          value="overview"
          className={
            currentTab === "overview"
              ? "data-[state=active]:bg-black data-[state=active]:text-white"
              : "bg-transparent"
          }
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="collection"
          className={
            currentTab === "collection"
              ? "data-[state=active]:bg-black data-[state=active]:text-white"
              : "bg-transparent"
          }
        >
          Collection
        </TabsTrigger>
        <TabsTrigger
          value="stats"
          className={
            currentTab === "stats"
              ? "data-[state=active]:bg-black data-[state=active]:text-white"
              : "bg-transparent"
          }
        >
          Statistics
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <ProfileOverview user={user} />
      </TabsContent>
      <TabsContent value="collection">
        <ProfileCollection user={user} />
      </TabsContent>
      <TabsContent value="stats">
        <ProfileStats user={user} />
      </TabsContent>
    </Tabs>
  );
}
