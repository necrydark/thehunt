/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Item, UserItem } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Props {
  initialPoints: number;
  initialItems: (UserItem & { item: Item })[];
  userId: string;
}

export default function ClientUserProgress({
  initialPoints,
  initialItems,
  userId,
}: Props) {
  const [totalPoints, setTotalPoints] = useState(initialPoints);
  const [obtainedItems, setObtainedItems] = useState(initialItems);

  useEffect(() => {
    const userChannel = supabase
      .channel(`user_progress_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user",
          filter: `id=eq.${userId}`,
        },
        (payload: any) => {
          if (payload.new.totalPoints !== totalPoints) {
            setTotalPoints(payload.new.totalPoints);
          }
        }
      )
      .subscribe();

    const userItemChannel = supabase
      .channel(`user_obtained-items_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_item",
          filter: `userId=eq.${userId}`,
        },
        async (payload: any) => {
          const newItemId = payload.new.itemId;
          const { data: itemData, error: itemError } = await supabase
            .from("item")
            .select("*")
            .eq("id", newItemId)
            .single();

          if (itemError) {
            return;
          }

          const newUserItem = {
            userId: payload.new.userId,
            itemId: payload.new.itemId,
            obtainedAt: payload.new.obtainedAt,
            item: itemData as Item,
          };

          setObtainedItems((prev) => [...prev, newUserItem]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userChannel);
      supabase.removeChannel(userItemChannel);
    };
  }, [userId, totalPoints]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">Your Progress</h2>
      <p className="text-xl text-yellow-400">Total Points: {totalPoints}</p>
      <p className="text-gray-400 mt-2">
        Obtained {obtainedItems.length} of {initialItems.length} items.
      </p>
    </div>
  );
}
