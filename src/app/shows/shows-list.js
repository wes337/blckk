"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Box from "@/components/box";
import ButtonLink from "@/components/button-link";
import SHOWS from "./data";
import Image from "next/image";

export default function ShowsList() {
  const container = useRef();

  useGSAP(
    () => {
      if (typeof window === "undefined" || SHOWS.length === 0) {
        return;
      }

      gsap.fromTo(
        ".shows-list",
        {
          translateY: "-800%",
        },
        { translateY: "0%", ease: "elastic", duration: 2, delay: 0.5 }
      );
    },
    { dependencies: [], scope: container }
  );

  if (SHOWS.length === 0) {
    return null;
  }

  return (
    <div ref={container}>
      <div className="shows-list translate-y-[-800%] -mb-2">
        {SHOWS.map((show) => {
          return (
            <Box key={`${show.date}-${show.city}`}>
              <div className="flex items-center justify-between gap-2 text-center w-[320px] text-shadow-[2px_2px_0px_#16232590] tracking-tight">
                <div className="w-[40%] text-yellow uppercase">{show.city}</div>
                <div className="w-[35%]">{show.date}</div>
                <div className="w-[25%]">
                  <ButtonLink
                    label="Tickets"
                    color="red"
                    size="sm"
                    href={show.ticketLink}
                    target="_blank"
                  />
                </div>
              </div>
            </Box>
          );
        })}
      </div>
    </div>
  );
}
