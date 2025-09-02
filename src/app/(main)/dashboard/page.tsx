// This is the users dashboard

import DashboardClient from "@/components/dashboard/dashboard-client";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { auth } from "@/lib/auth";
// import db from "@/lib/db"
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  return {
    title: `Dashboard`,
    description: `View your dashboard to view your progress and other stats.`,
  };
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <div className="min-h-screen w-full relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
          }}
        />

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Please sign in</h2>
          <p className="text-gray-600">
            You need to be logged in to view your dashboard
          </p>
          <Link href={"/login"}>Login</Link>
        </div>
      </div>
    );
  }

  if (session.user.banned) {
    return (
      <div className="min-h-screen w-full relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
          }}
        />

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">You are banned.</h2>
          {session?.user.banReason && <p>{session?.user.banReason}</p>}
          <Link href={"https://discord.com/invite/aGgVEzvg"}>
            Join The Discord
          </Link>
          <span>to get unbanned.</span>
        </div>
      </div>
    );
  }

  if (session.user.profileCompleted === false) {
    redirect("/complete-profile");
  }

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
        <div className="container relative mx-auto px-4  pt-[15rem] pb-[5rem]">
          <DashboardHeader
            user={{
              ...user,
              role: user?.role ?? undefined,
              totalPoints: user?.totalPoints ?? 0,
              vaultHunter: user?.vaultHunter ?? "Moze",
              platform: user?.platform ?? "PC",
            }}
          />
          <DashboardClient />
        </div>
      </div>
    </div>
  );
}
