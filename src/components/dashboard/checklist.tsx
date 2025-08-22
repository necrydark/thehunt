"use client";

import {
  itemTypes,
  rarityToClass,
  textRarityToClass,
} from "@/lib/item-changes";
import { Item } from "@prisma/client";
import { MapPin, Star, Target } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

interface UserUnlocks {
  items: Item[];
}

// const items = [
//   {
//     weapon: "Grenade",
//     group: "Unique",
//     source: "Moxxi Tip Jar",
//     name: "Moxxi's Bouncing Pair - M",
//     mission: "Vendor/Tip",
//     maps: ["Sanctuary III"],
//     rarity: "orange",
//     mayhem: "Any",
//     points: 2
//   }
// ]

export default function UserChecklist({ items }: UserUnlocks) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, idx) => (
        <div key={idx}>
          <Card className="bg-black relative h-full border-[#BBFE17]">
            <CardContent>
              <Badge className="absolute text-black bg-[#BBFE17] top-2 right-2">
                {item.points}
              </Badge>
              <h1 className=" text-primary-green mb-3 pr-10 text-lg font-semibold leading-snug">
                {item.name}
              </h1>
              <div className="mb-4 grid gap-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-neutral-400">Weapon</span>
                  <Badge
                    variant="outline"
                    className="bg-[#BBFE17] border-[#BBFE17]/75 text-black"
                  >
                    {item.type}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-neutral-400">Group</span>
                  <Badge className="bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/50">
                    {itemTypes(item.listGroup)}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-neutral-400">Source</span>
                  <div className="inline-flex items-center gap-1 rounded-full border bg-[#BBFE17] border-[#BBFE17]/75 text-black px-2 py-0.5">
                    <Target className="h-3.5 w-3.5 text-black" />
                    <span>{item.source}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-neutral-400">Mission</span>
                  <Badge
                    variant="outline"
                    className="bg-[#BBFE17] border-[#BBFE17]/75 text-black "
                  >
                    {item.missionType}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-neutral-400">Maps</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full border bg-[#BBFE17] border-[#BBFE17]/75 px-2 py-0.5 text-black ">
                      <MapPin className="h-3.5 w-3.5 text-black" />
                      {item.maps}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-neutral-400">Rarity</span>
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={`inline-block h-3.5 w-3.5 rounded-full ${
                        rarityToClass[item.rarity]
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`inline-flex items-center gap-1 ${
                        textRarityToClass[item.rarity]
                      } `}
                    >
                      <Star className="h-3.5 w-3.5 " />
                      {item.rarity}
                    </span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-neutral-400">Mayhem</span>
                  <Badge className="bg-[#BBFE17] text-black ">
                    {typeof item.mayhem === "number"
                      ? `M${item.mayhem}`
                      : item.mayhem}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
