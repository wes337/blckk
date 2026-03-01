"use client";

import { useEffect, useState } from "react";
import { isLive } from "@/utils";
import Box from "./box";

const TARGET = Date.UTC(2026, 2, 4, 19, 0, 0);

function getTimeLeft() {
  const diff = Math.max(0, TARGET - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const [live, setLive] = useState(isLive);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
      if (isLive()) setLive(true);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (live) return null;

  const segments = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="countdown fade-in">
      <Box className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 md:gap-5">
          {segments.map(({ label, value }, i) => (
            <div
              key={label}
              className="flex items-center justify-center gap-3 md:gap-5"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl md:text-4xl text-center text-white text-shadow-[2px_2px_0_black]">
                  {String(value).padStart(2, "0")}
                </span>
                <span className="text-xs md:text-sm text-gray text-center text-shadow-[1px_1px_0_black]">
                  {label}
                </span>
              </div>
              {i < segments.length - 1 && (
                <span className="text-2xl md:text-4xl text-gray text-shadow-[2px_2px_0_black] -mt-4">
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </Box>
    </div>
  );
}
