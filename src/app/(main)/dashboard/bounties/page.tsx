import Bounties from "@/components/bounties/bounties";
import ChecklistHeader from "@/components/checklist/checklist-header";
import { auth } from "@/lib/auth";
// import db from "@/lib/db"
import { headers } from "next/headers";
import Link from "next/link";

export default async function BountiesPage() {
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
          <Link href={"/contact"}>Contact Support</Link>
          <span>to get unbanned.</span>
        </div>
      </div>
    );
  }

  const user = session?.user;

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
          {/* Bounty Stats */}
          <ChecklistHeader user={user} />
          {/* All Bounties */}
          <Bounties />
        </div>
      </div>
    </div>
  );
}
