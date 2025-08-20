import LeaderboardClient from "@/components/leaderboard/leaderboard-client";
import LeaderboardHeader from "@/components/leaderboard/leaderboard-header";
import { auth } from "@/lib/auth";
// import db from "@/lib/db"
import { headers } from "next/headers";

export default async function LeaderboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  // const items = await db.item.findMany();

  // const userItems = await db.userItem.findMany({
  //   where:{ userId: session?.user.id},
  //   include: { item: true}
  // })

  // const obtainedItemsIds = new Set(userItems.map(ui => ui.itemId));
  // const unobtainedItems = items.filter(item => !obtainedItemsIds.has(item.id));

  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
        }}
      />

      <div className="h-full w-full relative z-10">
        <div className="container relative mx-auto px-4  pt-[12rem] pb-[5rem]">
          <h1 className="text-primary-green text-4xl font-bold">Leaderboard</h1>
          {user && (
            <LeaderboardHeader
              user={{
                ...user,
                totalPoints: user?.totalPoints as number,
              }}
            />
          )}

          <LeaderboardClient />
        </div>
      </div>
    </div>
  );
}
