"use client"

import { Twitch } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// const imageUrl = "../../public/countdown_item_bg.png"; 

const calculateTimeLeft = (): { timeLeft: TimeLeft; isExpired: boolean} => {
  const targetDate = new Date("2025-08-15T12:00:00").getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if(difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      timeLeft: {days, hours, minutes, seconds},
      isExpired: false
    }
  } else {
    return {
      timeLeft: {days: 0, hours: 0, minutes: 0, seconds: 0},
      isExpired: true
    }
  }
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const [isExpired, setIsExpired] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const updateCountdown = () => {
      const { timeLeft: newTimeLeft, isExpired: newIsExpired} =
       calculateTimeLeft();
       setTimeLeft(newTimeLeft);
       setIsExpired(newIsExpired)
       return newIsExpired;
    };

    if(updateCountdown()) return;

    const timer = setInterval(() => {
      if(updateCountdown()) {
        clearInterval(timer)
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [])

  if (!isMounted) {
    return (
      <div className="text-center">
        <div className="flex justify-center gap-8 text-white/70 opacity-0">
        <div className={`text-center bg-[url('../../public/countdown_item_bg.png')] rounded-lg p-3 min-w-[60px] shadow-lg`}>

            <div className="text-2xl font-bold drop-shadow-sm">--</div>
            <div className="text-xs text-[#969EB2] mt-1">days</div>
          </div>
          <div className={`text-center bg-[url('../../public/countdown_item_bg.png')] rounded-lg p-3 min-w-[60px] shadow-lg`}>

            <div className="text-2xl font-bold drop-shadow-sm">--</div>
            <div className="text-xs text-[#969EB2] mt-1">hrs</div>
          </div>
          <div className={`text-center bg-[url('../../public/countdown_item_bg.png')] rounded-lg p-3 min-w-[60px] shadow-lg`}>

            <div className="text-2xl font-bold drop-shadow-sm">--</div>
            <div className="text-xs text-[#969EB2] mt-1">min</div>
          </div>
          <div className={`text-center bg-[url('../../public/countdown_item_bg.png')] rounded-lg p-3 min-w-[60px] shadow-lg`}>

            <div className="text-2xl font-bold drop-shadow-sm">--</div>
            <div className="text-xs text-[#969EB2] mt-1">sec</div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex justify-center gap-8 text-white/80 animate-in fade-in duration-500">
       <div>
       <div className={`text-center  rounded-lg min-w-[80px] shadow-lg`}>
          <div className="text-2xl text-white font-bold bg-cover bg-center py-[27px] countdown-clip bg-[#1A1D26] px-[17px] mt-1 mb-2 bg-no-repeat bg-[url('../../public/countdown_item_bg.png')] drop-shadow-sm">
            {timeLeft.days}
          </div>
        </div>
          <div className="text-xs text-[#969EB2] uppercase mt-1 font-[600] text-[18px]">Days</div>
       </div>
       <div>
       <div className={`text-center  rounded-lg min-w-[80px] shadow-lg`}>
          <div className="text-2xl text-white font-bold bg-cover bg-center py-[27px] countdown-clip bg-[#1A1D26] px-[17px] mt-1 mb-2 bg-no-repeat bg-[url('../../public/countdown_item_bg.png')] drop-shadow-sm">
            {timeLeft.hours}
          </div>
        </div>
          <div className="text-xs text-[#969EB2] uppercase mt-1 font-[600] text-[18px]">Hours</div>
       </div>
       <div>
       <div className={`text-center  rounded-lg min-w-[80px] shadow-lg`}>
          <div className="text-2xl text-white font-bold bg-cover bg-center py-[27px] countdown-clip bg-[#1A1D26] px-[17px] mt-1 mb-2 bg-no-repeat bg-[url('../../public/countdown_item_bg.png')] drop-shadow-sm">
            {timeLeft.minutes}
          </div>
        </div>
          <div className="text-xs text-[#969EB2] uppercase mt-1 font-[600] text-[18px]">Minutes</div>
       </div>
       <div>
       <div className={`text-center  rounded-lg min-w-[80px] shadow-lg`}>
          <div className="text-2xl text-white font-bold bg-cover bg-center py-[27px] countdown-clip bg-[#1A1D26] px-[17px] mt-1 mb-2 bg-no-repeat bg-[url('../../public/countdown_item_bg.png')] drop-shadow-sm">
            {timeLeft.seconds}
          </div>
        </div>
          <div className="text-xs text-[#969EB2] uppercase font-[600] text-[18px] mt-1 ">Seconds</div>
       </div>
      </div>
      <div className="flex gap-4 flex-row space-y-4 justify-center sm:space-y-0 sm:space-x-4 mt-8 w-full sm:w-auto">
        <Link href={"#how-to-participate"}>
        <Button className="bg-[#BBFE17] hover:bg-[#BBFE17]/75 duration-300 transition-all w-full sm:w-auto text-black">
              Join The Cause
            </Button>
        </Link>
        {isExpired && (
              <Button className="bg-[#9146FF] hover:bg-[#9146FF]/75 duration-300 transition-all w-1/2 sm:w-auto">
              <Twitch className="mr-2 w-4 h-4 justify-center text-white" />
              View On Twitch
            </Button>
        )}
          </div>
    
    </div>
  );
}