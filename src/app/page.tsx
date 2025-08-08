
import Hero from "@/components/hero";
import Carousels from "@/components/home/carousels";
import RulesSection from "@/components/home/rules-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { previous } from "@/data/data";
import { auth } from "@/lib/auth";
import { Calendar } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";



export default async function Home() {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  console.log(session)

  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
        }}
      />
      <Hero />
      {/* How To Participate */}
      <section className="container max-w-6xl  relative z-10 mx-auto pt-[9rem]" id="how-to-participate">
        <h1 className="text-3xl font-bold uppercase text-[#BBFE17] text-center  ">How To Participate</h1>
        <p className="mb-8 mt-4 text-muted-foreground text-[14px] text-center">If you&apos;re new here, check out how to join along in all the mayhem!</p>
        <div className="flex flex-col justify-center items-center  gap-4">
            <div className="flex w-[300px] gap-2">
              <div className="bg-[#BBFE17] rounded-full p-3 h-fit text-2xl">
                1
              </div>
              <div>
                <h2 className="text-white font-bold text-2xl">Get Started</h2>
                <p className="text-white ">Register your account and copy the 
                  <Link href={"https://docs.google.com/spreadsheets/d/1NNuIHoswvRbsuSWE794pABST5nC6pXMGAUJkw8SyVsg/edit?gid=0#gid=0"} className="text-[#BBFE17] hover:underline" target="_blank">
                  {" "}spreadsheet.
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex w-[300px] gap-2">
              <div className="bg-[#BBFE17] rounded-full h-fit p-3 text-2xl">
                2
              </div>
              <div>
                <h2 className="text-white font-bold text-2xl">Stream Your Run</h2>
                <p className="text-white ">Stream the entirety of your run on Twitch or YouTube.</p>
              </div>
            </div>
            <div className="flex w-[300px] gap-2">
              <div className="bg-[#BBFE17] rounded-full h-fit p-3 text-2xl">
                3
              </div>
              <div>
                <h2 className="text-white font-bold text-2xl">Finale</h2>
                <p className="text-white ">Acculumate points and rank high on the leaderboard.</p>
              </div>
            </div>
        </div>
      </section>
      <Carousels />
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
        }}
      />
      <section className="w-full bg-gradient-to-b  via-black to-[#072607] relative">
        
        <div className="container max-w-6xl mx-auto flex flex-col gap-6 justify-center items-center  relative p-[4rem] z-10">
          <h1 className="text-4xl font-bold text-[#BBFE17] mb-4">Join the cause</h1>
          <div className="grid md:grid-cols-2 grid-cols-1 justify-items-center gap-2">
            <Image
            src={"/vault-hunters-bl2.jpeg"}
            alt="Picture of the Vault Hunters on a bridge shooting enemies"
            width={500} 
            height={500}
            priority
            />
            <div>
              <h2 className="text-2xl font-bold text-[#BBFE17]">Raising Money for the Kids, One bounty at a Time</h2>
              <p className="text-white text-[14px]">The Borderlands Community unites for the ultimate gaming scavenger hunt! In this event, Vault Hunters race to loot the rarest items in the game. The player who completes the list in the shortest time from new character creation will be crowned the Champion! This in-game event also raises funds for St. Jude Children’s Research Hospital.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 justify-items-center gap-10 mt-6">
            <div>
            <Image
            priority
            width={150}
            height={150}
            alt="Borderlands Community Fundraising Team Logo"
            src="/bl-community.png"
            className="mx-auto"
          />
          <div className="flex gap-2 items-center justify-center mt-2">
          <h2 className="text-3xl font-bold text-[#BBFE17]">Raised</h2>
          <p className="text-[#E80063] text-2xl italic">$514<span className="text-xl">k</span></p>   
          </div>
            </div>
            <div>
            <Image
            priority
            width={150}
            height={150}
            alt="The Hunt Prepare For Mayhem Logo"
            src="/Logo-Medium.png"
            className="mx-auto"
          />
          <div className="flex gap-2 items-center justify-center mt-2">
          <h2 className="text-3xl font-bold text-[#BBFE17]">Raised</h2>
          <p className="text-[#E80063] text-2xl italic">$0</p>   
          </div>
            </div>
          </div>
          <Link href={"#"}>
          <Button className="bg-[#BBFE17] hover:bg-[#BBFE17]/75 cursor-pointer text-black">
              Donate
            </Button>
          </Link>

          <div className="pt-8 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold text-[#BBFE17] text-center mb-10">Assets</h1>
          <Image 
          src={"/overlay-example.webp"}
          width={600}
          height={600}
          alt="Overlay Example"
          className=""
          />
          <h2 className="mt-2  text-4xl font-bold text-[#BBFE17] text-center">Stream Overlay</h2>
          <p className="text-sm mb-6 mt-2 text-muted-foreground text-center">By PilotPlays Games</p>
          <Link href={"/obs-overlay.zip"}>
          <Button className="bg-[#BBFE17] hover:bg-[#BBFE17]/75 cursor-pointer  text-black">
              Download
            </Button>
          </Link>
          </div>
        </div>  
      </section>

      {/* Cards */}
      <section className="w-full relative bg-gradient-to-t from-[0%] from-[#072607]  via-black via-[40%] to-[#072607]">
          <div className="py-20">
            <h1 className="text-4xl font-bold text-[#BBFE17] text-center mb-10">Not Our First Rodeo</h1>
            <div className=" container max-w-6xl mx-auto grid md:grid-cols-3 grid-cols-1 gap-6 justify-items-center">
              {previous.map((prev, idx) => (
                <Card key={idx} className="group hover:shadow-lg bg-black border-[#BBFE17] shadow-lg shadow-[#BBFE17]/50 !py-0 transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                  <CardContent className="p-0 flex-1 flex h-80 bg-black flex-col">
                    <div className="relative overflow-hidden ">
                      <Image 
                      src={prev.image}
                      alt={prev.name as string}
                      width={259}
                      height={200}
                      className="bg-transparent object-cover mx-auto group-hover:scale-105 transition-transform duration-300" />
                      <Badge className="absolute bg-[#BBFE17] top-2 right-2 text-black">{prev.game}</Badge>
                    </div>
                    <div className="mt-4 flex py-8 flex-col justify-center items-center space-y-2 px-2">
                      <h1 className="text-xl  font-bold text-[#BBFE17]">{prev.name}</h1>
                      <p className="text-lg text-[#BBFE17]">${prev.raised} Raised</p>
                      <p className="flex items-center text-[#BBFE17]"><Calendar className="h-4 w-4 mr-2" />{prev.date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
      </section>

      {/* Rules */}
      <section className="w-full bg-gradient-to-b  via-black from-[#072607] to-black relative" id="rules">
            <div className="container max-w-7xl py-20 mx-auto">
              <h1 className="text-center text-[#BBFE17] font-bold text-4xl">Official BL3 Hunt 2025 Rules</h1>
              <p className="text-xl text-muted-foreground text-center mt-2">Subject to update, but to be strictly followed</p>
              <RulesSection />
            </div>
      </section>

    </div>
  );
}
