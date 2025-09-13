"use client";

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

const calculateTimeLeft = (): { timeLeft: TimeLeft; isExpired: boolean } => {
  const targetDate = new Date("2025-08-15T17:00:00").getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      timeLeft: { days, hours, minutes, seconds },
      isExpired: false,
    };
  } else {
    return {
      timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      isExpired: true,
    };
  }
};

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isExpired, setIsExpired] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const updateCountdown = () => {
      const { timeLeft: newTimeLeft, isExpired: newIsExpired } =
        calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      setIsExpired(newIsExpired);
      return newIsExpired;
    };

    if (updateCountdown()) return;

    const timer = setInterval(() => {
      if (updateCountdown()) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) {
    return (
      <div className="text-center">
        <div className="flex justify-center gap-4 md:gap-6">
          {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
            <div key={label} className="flex flex-col items-center">
              <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 min-w-[80px] shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  --
                </div>
              </div>
              <div className="text-xs md:text-sm text-green-400 uppercase mt-2 font-semibold tracking-wider">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className="text-center space-y-8">
      <div className="flex justify-center gap-4 md:gap-6 animate-in fade-in duration-500">
        {timeUnits.map((unit, index) => (
          <div key={index} className="flex flex-col items-center group">
            <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 min-w-[80px] shadow-lg group-hover:border-green-400/50 group-hover:shadow-green-400/20 transition-all duration-300">
              <div className="text-2xl md:text-3xl font-bold text-white flex justify-center transition-all duration-300">
                {unit.value.toString().padStart(2, "0")}
              </div>
            </div>
            <div className="text-xs md:text-sm text-green-400 uppercase mt-2 font-semibold tracking-wider group-hover:text-green-300 transition-colors">
              {unit.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link href={"#how-to-participate"}>
          <Button className=" bg-primary-green hover:bg-primary-green/75 text-black font-semibold py-3 rounded-lg transition-all duration-300">
            Join The Cause
          </Button>
        </Link>
        {isExpired && (
          <Link
            href={"https://www.twitch.tv/ki11ersix"}
            rel="noreferrer noopener"
            target="_blank"
          >
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105">
              <Twitch className="mr-2 w-4 h-4" />
              View On Twitch
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
