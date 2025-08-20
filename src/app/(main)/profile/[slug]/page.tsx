import { getUser } from "@/actions/user";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileRealTimeUpdater from "@/components/profile/profile-real-time-updater";
import ProfileTabs from "@/components/profile/profile-tabs";
import { Button } from "@/components/ui/button";
import { getAllUserItems } from "@/data/profile";
import { Item, UserItem } from "@prisma/client";
import Link from "next/link";

interface UserProfileData {
  id: string;
  name: string;
  image: string | null;
  totalPoints: number;
  obtainedItems: (UserItem & { item: Item })[];
  // Add other user fields you want to display
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const user = await getUser(slug);

  return {
    title: `${user?.name}'s Profile`,
    description: `View the profile and activity of ${user?.name}`,
  };
}
// User Profile for other users to visit and see

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const user = await getUser(slug);
  // const items = await getAllItems();
  const unlocks = await getAllUserItems(slug);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1>oops... user not found!</h1>
        <Link href={"/"}>
          <Button>Go Back</Button>
        </Link>
      </div>
    );
  }

  const initialUserData: UserProfileData = {
    id: user.id,
    name: user.name,
    image: user.image,
    totalPoints: user.totalPoints ?? 0,
    obtainedItems: unlocks?.userItems ?? [],
  };
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
        <div className="container relative max-w-[1200px] mx-auto px-4  pt-[15rem] pb-[5rem]">
          <ProfileHeader
            user={{
              ...user,
              role: user.role,
              totalPoints: user.totalPoints as number,
            }}
          />
          {/* Checklist */}
          <section className="mt-8 w-full">
            <ProfileTabs
              user={{
                ...user,
                totalPoints: user.totalPoints as number,
                role: user.role,
              }}
            />
          </section>
        </div>
      </div>
      <ProfileRealTimeUpdater initialData={initialUserData} />
    </div>
  );
}
