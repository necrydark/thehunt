import { getUser } from "@/actions/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Twitch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Params = Promise<{slug: string}>

export default async function ProfilePage({ params }: {params: Params}) {
  const {slug} = await params;
  const user = await getUser(slug);
  if(!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1>oops... user not found!</h1>
          <Link href={"/"}>
        <Button>
          Go Back
        </Button>
          </Link>
      </div>
    )
  }
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
        <Card className="h-[1200px] bg-gradient-to-br from-green-800 shadow-lg shadow-[#BBFE17]/50 overflow-hidden border-2 border-[#BBFE17] to-80% to-black">
        <div className="flex lg:flex-row flex-col space-x-4 justify-between px-8">
          {/* Image / Name */}
          <div className="flex  md:flex-row flex-col justify-center items-center h-fit gap-2">
            <Image 
            src={user?.image as string}
            alt={`${user?.name}'s Profile Image`}
            width={150}
            height={150}
            className="overflow-hidden rounded-full border-2 border-[#BBFE17] "
            />
            <div className="flex flex-col md:items-start items-center lg:pb-0 pb-[2rem] space-y-2">
            <h1 className="text-3xl font-bold  text-[#BBFE17] ">{user?.name}</h1>
            <Badge>{user?.role}</Badge>
            <p className="text-white">Points: {user?.totalPoints}</p>
            <p className="text-white">Joined The Hunt {user?.createdAt.toLocaleDateString()}</p>
            <Link href={`https://www.twitch.tv/${user?.name}`}
            target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#9146FF] w-full hover:bg-[#9146FF]/75 cursor-pointer duration-300 transition-all sm:w-auto">
              <Twitch className="mr-2 w-4 h-4 justify-center text-white" />
              View On Twitch
            </Button>
            </Link>
            </div>
          </div>
          {/* Iframe for stream */}
          <div className="flex justify-center items-center">
            <iframe 
            src={`https://player.twitch.tv/?channel=${user?.name}&parent=localhost&muted=true&autoplay=false`}
            allowFullScreen
            width={"450"}
            height={"450"}
            scrolling="no"
            />
          </div>
        </div>
        </Card>
      </div>
  </div>
    </div>
  )
}
