
// import { Hero } from "@/components/hero";
// import Carousels from "@/components/home/carousels";
// import RulesSection from "@/components/home/rules-section";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { previous } from "@/data/data";
// // import { auth } from "@/lib/auth";
// import { Calendar } from "lucide-react";
// // import { headers } from "next/headers";
// import Image from "next/image";
// import Link from "next/link";



// export default async function Home() {

//   // const session = await auth.api.getSession({
//   //   headers: await headers()
//   // })


//   return (
//     <div className="min-h-screen w-full relative">
//       <div
//         className="absolute inset-0 z-0"
//         style={{
//           background:
//             "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
//         }}
//       />
//       <Hero />
//       {/* How To Participate */}
//       <section className="container max-w-6xl  relative z-10 mx-auto pt-[9rem]" id="how-to-participate">
//         <h1 className="text-3xl font-bold uppercase text-primary-green text-center  ">How To Participate</h1>
//         <p className="mb-8 mt-4 text-muted-foreground text-[14px] text-center">If you&apos;re new here, check out how to join along in all the mayhem!</p>
//         <div className="flex flex-col justify-center items-center  gap-4">
//             <div className="flex w-[300px] gap-2">
//               <div className="bg-[#BBFE17] rounded-full p-3 h-fit text-2xl">
//                 1
//               </div>
//               <div>
//                 <h2 className="text-white font-bold text-2xl">Get Started</h2>
//                 <p className="text-white ">  <Link href={"/login"} className="text-primary-green hover:underline">
//                   {" "}Register
//                   </Link> your account to get started. 
                
//                 </p>
//               </div>
//             </div>
//             <div className="flex w-[300px] gap-2">
//               <div className="bg-[#BBFE17] rounded-full h-fit p-3 text-2xl">
//                 2
//               </div>
//               <div>
//                 <h2 className="text-white font-bold text-2xl">Stream Your Run</h2>
//                 <p className="text-white ">Stream the entirety of your run on Twitch or YouTube.</p>
//               </div>
//             </div>
//             <div className="flex w-[300px] gap-2">
//               <div className="bg-[#BBFE17] rounded-full h-fit p-3 text-2xl">
//                 3
//               </div>
//               <div>
//                 <h2 className="text-white font-bold text-2xl">Finale</h2>
//                 <p className="text-white ">Accumulate Points <span className="text-[10px] italic">(in Joltz&apos;s voice)</span> and rank high on the scoreboard.</p>
//               </div>
//             </div>
//         </div>
//       </section>
//       <Carousels />
//       <div
//         className="absolute inset-0 z-0"
//         style={{
//           background:
//             "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
//         }}
//       />
//       <section className="w-full bg-gradient-to-b  via-black to-[#072607] relative">
        
//         <div className="container max-w-6xl mx-auto flex flex-col gap-6 justify-center items-center  relative p-[4rem] z-10">
//           <h1 className="text-4xl font-bold text-primary-green mb-4">Join the cause</h1>
//           <div className="grid md:grid-cols-2 grid-cols-1 justify-items-center gap-2">
//             <Image
//             src={"/vault-hunters-bl2.jpeg"}
//             alt="Picture of the Vault Hunters on a bridge shooting enemies"
//             width={500} 
//             height={500}
//             priority
//             />
//             <div>
//               <h2 className="text-2xl font-bold text-primary-green">Raising Money for the Kids, One bounty at a Time</h2>
//               <p className="text-white text-[14px]">The Borderlands Community unites for the ultimate gaming scavenger hunt! In this event, Vault Hunters race to loot the rarest items in the game. The player who completes the list in the shortest time from new character creation will be crowned the Champion! This in-game event also raises funds for St. Jude Children’s Research Hospital.</p>
//             </div>
//           </div>
//           <div className="grid md:grid-cols-2 grid-cols-1 justify-items-center gap-10 mt-6">
//             <div>
//             <Image
//             priority
//             width={150}
//             height={150}
//             alt="Borderlands Community Fundraising Team Logo"
//             src="/bl-community.png"
//             className="mx-auto"
//           />
//           <div className="flex gap-2 items-center justify-center mt-2">
//           <h2 className="text-3xl font-bold text-primary-green">Raised</h2>
//           <p className="text-[#E80063] text-2xl italic">$514<span className="text-xl">k</span></p>   
//           </div>
//             </div>
//             <div>
//             <Image
//             priority
//             width={150}
//             height={150}
//             alt="The Hunt Prepare For Mayhem Logo"
//             src="/Logo-Medium.png"
//             className="mx-auto"
//           />
//           <div className="flex gap-2 items-center justify-center mt-2">
//           <h2 className="text-3xl font-bold text-primary-green">Raised</h2>
//           <p className="text-[#E80063] text-2xl italic">$0</p>   
//           </div>
//             </div>
//           </div>
//           <Link href={"#"}>
//           <Button className="bg-[#BBFE17] hover:bg-[#BBFE17]/75 cursor-pointer text-black">
//               Donate
//             </Button>
//           </Link>

//           <div className="pt-8 flex flex-col justify-center items-center">
//           <h1 className="text-4xl font-bold text-primary-green text-center mb-10">Assets</h1>
//           <Image 
//           src={"/overlay-example.webp"}
//           width={600}
//           height={600}
//           alt="Overlay Example"
//           className=""
//           />
//           <h2 className="mt-2  text-4xl font-bold text-primary-green text-center">Stream Overlay</h2>
//           <p className="text-sm mb-6 mt-2 text-muted-foreground text-center">By PilotPlays Games</p>
//           <Link href={"/obs-overlay.zip"}>
//           <Button className="bg-[#BBFE17] hover:bg-[#BBFE17]/75 cursor-pointer  text-black">
//               Download
//             </Button>
//           </Link>
//           </div>
//         </div>  
//       </section>

//       {/* Cards */}
//       <section className="w-full relative bg-gradient-to-t from-[0%] from-[#072607]  via-black via-[40%] to-[#072607]">
//           <div className="py-20">
//             <h1 className="text-4xl font-bold text-primary-green text-center mb-10">Not Our First Rodeo</h1>
//             <div className=" container max-w-6xl mx-auto grid md:grid-cols-3 grid-cols-1 gap-6 justify-items-center">
//               {previous.map((prev, idx) => (
//                 <Card key={idx} className="group hover:shadow-lg bg-black border-[#BBFE17] shadow-lg shadow-[#BBFE17]/50 !py-0 transition-shadow duration-300 overflow-hidden h-full flex flex-col">
//                   <CardContent className="p-0 flex-1 flex h-80 bg-black flex-col">
//                     <div className="relative overflow-hidden ">
//                       <Image 
//                       src={prev.image}
//                       alt={prev.name as string}
//                       width={259}
//                       height={200}
//                       className="bg-transparent object-cover mx-auto group-hover:scale-105 transition-transform duration-300" />
//                       <Badge className="absolute bg-[#BBFE17] top-2 right-2 text-black">{prev.game}</Badge>
//                     </div>
//                     <div className="mt-4 flex py-8 flex-col justify-center items-center space-y-2 px-2">
//                       <h1 className="text-xl  font-bold text-primary-green">{prev.name}</h1>
//                       <p className="text-lg text-primary-green">${prev.raised} Raised</p>
//                       <p className="flex items-center text-primary-green"><Calendar className="h-4 w-4 mr-2" />{prev.date}</p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//       </section>

//       {/* Rules */}
//       <section className="w-full bg-gradient-to-b  via-black from-[#072607] to-black relative" id="rules">
//             <div className="container max-w-7xl py-20 mx-auto">
//               <h1 className="text-center text-primary-green font-bold text-4xl">Official BL3 Hunt 2025 Rules</h1>
//               <p className="text-xl text-muted-foreground text-center mt-2">Subject to update, but to be strictly followed</p>
//               <RulesSection />
//             </div>
//       </section>

//     </div>
//   );
// }


import { Hero } from "@/components/hero"
import Carousels from "@/components/home/carousels"
import RulesSection from "@/components/home/rules-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { previous } from "@/data/data"
// import { auth } from "@/lib/auth";
import { Calendar } from "lucide-react"
// import { headers } from "next/headers";
import Image from "next/image"
import Link from "next/link"

export default async function Home() {
  // const session = await auth.api.getSession({
  //   headers: await headers()
  // })

  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
        }}
      />
      <Hero />
      {/* How To Participate */}
      <section className="container max-w-6xl relative z-10 mx-auto pt-[9rem] px-4" id="how-to-participate">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold uppercase text-[#BBFE17] mb-4">How To Participate</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            If you&apos;re new here, check out how to join along in all the mayhem!
          </p>
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 gap-8 max-w-5xl mx-auto">
          <Card className="group bg-black/40 backdrop-blur-sm border-[#BBFE17]/30 hover:border-[#BBFE17] transition-all duration-300 hover:shadow-lg hover:shadow-[#BBFE17]/20">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-[#BBFE17] to-[#9FE317] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-black text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h2 className="text-white font-bold text-2xl mb-4">Get Started</h2>
              <p className="text-gray-300 leading-relaxed">
                <Link href={"/login"} className="text-[#BBFE17] hover:underline font-semibold">
                  Register
                </Link>{" "}
                your account to get started and join the hunt for legendary loot.
              </p>
            </CardContent>
          </Card>

          <Card className="group bg-black/40 backdrop-blur-sm border-[#BBFE17]/30 hover:border-[#BBFE17] transition-all duration-300 hover:shadow-lg hover:shadow-[#BBFE17]/20">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-[#BBFE17] to-[#9FE317] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-black text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h2 className="text-white font-bold text-2xl mb-4">Stream Your Run</h2>
              <p className="text-gray-300 leading-relaxed">
                Stream the entirety of your run on Twitch or YouTube for verification and community engagement.
              </p>
            </CardContent>
          </Card>

          <Card className="group bg-black/40 backdrop-blur-sm border-[#BBFE17]/30 hover:border-[#BBFE17] transition-all duration-300 hover:shadow-lg hover:shadow-[#BBFE17]/20">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-[#BBFE17] to-[#9FE317] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-black text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h2 className="text-white font-bold text-2xl mb-4">Climb the Ranks</h2>
              <p className="text-gray-300 leading-relaxed">
                Accumulate Points <span className="text-xs italic text-[#BBFE17]">(in Joltz&apos;s voice)</span> and rank
                high on the scoreboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <Carousels />
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
        }}
      />
      <section className="w-full bg-gradient-to-b via-black to-[#072607] relative">
        <div className="container max-w-6xl mx-auto relative p-16 z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-[#BBFE17] mb-6">Join the Cause</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The Borderlands Community unites for the ultimate gaming scavenger hunt while raising funds for St. Jude
              Children&apos;s Research Hospital.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-12 items-center mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#BBFE17]/20 to-transparent rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <Image
                src={"/vault-hunters-bl2.jpeg"}
                alt="Picture of the Vault Hunters on a bridge shooting enemies"
                width={600}
                height={400}
                priority
                className="relative rounded-lg shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#BBFE17] leading-tight">
                Raising Money for the Kids, One Bounty at a Time
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Vault Hunters race to loot the rarest items in the game. The player who completes the list in the
                shortest time from new character creation will be crowned the Champion!
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge className="bg-[#BBFE17]/20 text-[#BBFE17] border-[#BBFE17]/30 px-4 py-2">Charity Event</Badge>
                <Badge className="bg-[#BBFE17]/20 text-[#BBFE17] border-[#BBFE17]/30 px-4 py-2">Community Driven</Badge>
                <Badge className="bg-[#BBFE17]/20 text-[#BBFE17] border-[#BBFE17]/30 px-4 py-2">Competitive</Badge>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-12 mb-12">
            <Card className="bg-black/40 backdrop-blur-sm border-[#BBFE17]/30 hover:border-[#BBFE17] transition-all duration-300 hover:shadow-lg hover:shadow-[#BBFE17]/20">
              <CardContent className="p-8 text-center">
                <Image
                  priority
                  width={120}
                  height={120}
                  alt="Borderlands Community Fundraising Team Logo"
                  src="/bl-community.png"
                  className="mx-auto mb-6 hover:scale-110 transition-transform duration-300"
                />
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#BBFE17]">Community Total</h3>
                  <p className="text-4xl font-bold text-[#E80063]">
                    $514<span className="text-2xl">k</span>
                  </p>
                  <p className="text-gray-400">Raised for St. Jude</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-[#BBFE17]/30 hover:border-[#BBFE17] transition-all duration-300 hover:shadow-lg hover:shadow-[#BBFE17]/20">
              <CardContent className="p-8 text-center">
                <Image
                  priority
                  width={120}
                  height={120}
                  alt="The Hunt Prepare For Mayhem Logo"
                  src="/Logo-Medium.png"
                  className="mx-auto mb-6 hover:scale-110 transition-transform duration-300"
                />
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#BBFE17]">This Event</h3>
                  <p className="text-4xl font-bold text-[#E80063]">$0</p>
                  <p className="text-gray-400">Let&apos;s change this!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href={"#"}>
              <Button className="bg-gradient-to-r from-[#BBFE17] to-[#9FE317] hover:from-[#9FE317] hover:to-[#BBFE17] text-black font-bold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Donate Now
              </Button>
            </Link>
          </div>

          <div className="pt-20 text-center">
            <h2 className="text-4xl font-bold text-[#BBFE17] mb-6">Stream Assets</h2>
            <p className="text-gray-300 mb-12 text-lg">Professional overlays to enhance your streaming experience</p>

            <Card className="bg-black/40 backdrop-blur-sm border-[#BBFE17]/30 hover:border-[#BBFE17] transition-all duration-300 hover:shadow-lg hover:shadow-[#BBFE17]/20 max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="relative group mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#BBFE17]/10 to-transparent rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Image
                    src={"/overlay-example.webp"}
                    width={700}
                    height={400}
                    alt="Overlay Example"
                    className="relative rounded-lg shadow-xl group-hover:scale-105 transition-transform duration-300 mx-auto"
                  />
                </div>
                <h3 className="text-3xl font-bold text-[#BBFE17] mb-2">Professional Stream Overlay</h3>
                <p className="text-gray-400 mb-6">Created by PilotPlays Games</p>
                <Link href={"/obs-overlay.zip"}>
                  <Button className="bg-gradient-to-r from-[#BBFE17] to-[#9FE317] hover:from-[#9FE317] hover:to-[#BBFE17] text-black font-bold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Download Assets
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full relative bg-gradient-to-t from-[0%] from-[#072607] via-black via-[40%] to-[#072607]">
        <div className="py-24">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-[#BBFE17] mb-4">Not Our First Rodeo</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our community has a proven track record of successful charity events
            </p>
          </div>

          <div className="container max-w-6xl mx-auto grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 px-4">
            {previous.map((prev, idx) => (
              <Card
                key={idx}
                className="group hover:shadow-2xl bg-black/60 backdrop-blur-sm border-[#BBFE17]/30 hover:border-[#BBFE17] shadow-lg hover:shadow-[#BBFE17]/30 transition-all duration-300 overflow-hidden h-full flex flex-col hover:scale-105"
              >
                <CardContent className="p-0 flex-1 flex flex-col">
                  <div className="relative overflow-hidden">
                    <Image
                      src={prev.image || "/placeholder.svg"}
                      alt={prev.name as string}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <Badge className="absolute bg-gradient-to-r from-[#BBFE17] to-[#9FE317] top-4 right-4 text-black font-semibold px-3 py-1">
                      {prev.game}
                    </Badge>
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-[#BBFE17] text-center">{prev.name}</h3>
                    <div className="text-center space-y-2">
                      <p className="text-2xl font-bold text-[#E80063]">${prev.raised}</p>
                      <p className="text-gray-400">Raised for Charity</p>
                    </div>
                    <div className="flex items-center text-gray-300 bg-black/40 rounded-full px-4 py-2">
                      <Calendar className="h-4 w-4 mr-2 text-[#BBFE17]" />
                      {prev.date}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="w-full bg-gradient-to-b via-black from-[#072607] to-black relative" id="rules">
        <div className="container max-w-7xl py-20 mx-auto">
          <h1 className="text-center text-[#BBFE17] font-bold text-4xl">Official BL3 Hunt 2025 Rules</h1>
          <p className="text-xl text-gray-300 text-center mt-2">Subject to update, but to be strictly followed</p>
          <RulesSection />
        </div>
      </section>
    </div>
  )
}
