/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { type Item, type UserItem } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UserProfileData {
  id: string;
  name: string;
  image: string | null;
  totalPoints: number;
  obtainedItems: (UserItem & { item: Item })[];
}

export default function ProfileRealtimeUpdater({
  initialData,
}: {
  initialData: UserProfileData;
}) {
  const [profileData, setProfileData] = useState<UserProfileData>(initialData);

  useEffect(() => {
    const userChannel = supabase
      .channel(`profile_user_${initialData.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user",
          filter: `id=eq.${initialData.id}`,
        },
        (payload: any) => {
          if (payload.new.totalPoints !== profileData.totalPoints) {
            setProfileData((prev) => ({
              ...prev,
              totalPoints: payload.new.totalPoints,
            }));
          }
        }
      )
      .subscribe();

    const userItemChannel = supabase
      .channel(`profile_user_items_${initialData.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_item",
          filter: `userId=eq.${initialData.id}`,
        },
        async (payload: any) => {
          const newItemId = payload.new.itemId;
          const { data: itemData, error: itemError } = await supabase
            .from("item")
            .select("*")
            .eq("id", newItemId)
            .single();

          if (itemError) {
            console.error(
              "Error fetching new item details for realtime update:",
              itemError
            );
            return;
          }

          const newUserItem = {
            userId: payload.new.userId,
            itemId: payload.new.itemId,
            obtainedAt: payload.new.obtainedAt,
            item: itemData as Item,
          };

          setProfileData((prev) => ({
            ...prev,
            obtainedItems: [...prev.obtainedItems, newUserItem],
          }));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(userChannel);
      supabase.removeChannel(userItemChannel);
    };
  }, [initialData.id, profileData.totalPoints]);

  return null;
}
