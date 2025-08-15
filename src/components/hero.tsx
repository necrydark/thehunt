// import Image from "next/image";
// import { CountdownTimer } from "./countdown-timer";




// const Hero = () => {
//   return (
//     <div className="h-full w-full relative z-10">


//     {/* Logo and Countdown Timer */}
//     <section className="container relative max-w-xl mx-auto px-4  pt-[15rem]">
//     <div className="flex space-y-4 justify-center items-center flex-col">
//       <Image
//       width={340}
//       height={340}
//       alt="The Hunt Prepare For Mayhem Logo"
//          className="max-w-[250px] md:max-w-[340px] h-auto"
//       src={"/Logo-Medium.png"}
//       />
//       <h1 className="text-primary-green text-xl md:text-2xl font-bold italic">August 15th, 2025</h1>
//       <CountdownTimer />
     
//     </div>
//     </section>


  
// </div>
 
//   )
// }

// export default Hero;


import Image from "next/image"
import { CountdownTimer } from "./countdown-timer"

export const Hero = () => {
  return (
    <div className="h-full w-full relative z-10">
      <section className="container relative max-w-4xl mx-auto  px-4  pt-[15rem]">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo with enhanced styling */}
          <div className="relative group">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl group-hover:bg-green-400/30 transition-all duration-500"></div>
            <Image
              width={340}
              height={340}
              alt="The Hunt Prepare For Mayhem Logo"
              className="relative max-w-[280px] md:max-w-[380px] h-auto drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
              src={"/Logo-Medium.png"}
              priority
            />
          </div>

          {/* Date with improved typography */}
          <div className="space-y-2">
            <h1 className="text-green-400 text-2xl md:text-3xl font-bold tracking-wide">August 15th, 2025</h1>
            <p className="text-gray-300 text-lg md:text-xl font-medium">The Ultimate Borderlands Charity Hunt</p>
          </div>

          {/* Enhanced countdown timer */}
          <div className="w-full max-w-2xl">
            <CountdownTimer />
          </div>
        </div>
      </section>
    </div>
  )
}
