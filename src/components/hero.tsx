import Image from "next/image";
import { CountdownTimer } from "./countdown-timer";




const Hero = () => {
  return (
    <div className="h-full w-full relative z-10">


    {/* Logo and Countdown Timer */}
    <section className="container relative max-w-xl mx-auto px-4  pt-[15rem]">
    <div className="flex space-y-4 justify-center items-center flex-col">
      <Image
      width={340}
      height={340}
      alt="The Hunt Prepare For Mayhem Logo"
         className="max-w-[250px] md:max-w-[340px] h-auto"
      src={"/Logo-Medium.png"}
      />
      <h1 className="text-white text-xl md:text-2xl font-bold italic">August 15th, 2025</h1>
      <CountdownTimer />
     
    </div>
    </section>


  
</div>
 
  )
}

export default Hero;

