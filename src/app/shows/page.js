"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Box from "@/components/box";
import Card from "@/components/card";
import Cards from "@/components/cards";
import Footer from "@/components/footer";
import Image from "next/image";

export default function ShowsPage() {
  const container = useRef();

  useGSAP(
    () => {
      if (typeof window === "undefined") {
        return;
      }

      gsap.fromTo(
        ".form",
        {
          translateY: "100%",
        },
        { translateY: "0%", ease: "elastic", duration: 2 }
      );
    },
    { dependencies: [], scope: container }
  );

  return (
    <div
      ref={container}
      className="fixed top-0 left-0 w-full h-full flex flex-col gap-8 items-center justify-center z-10"
    >
      <div className="text-2xl text-shadow-[2px_2px_0px_#16232590] uppercase">
        Shows
      </div>
      <div className="form flex flex-col gap-2 items-center justify-center">
        <Box>
          <div className="text-xl text-shadow-[2px_2px_0px_#16232590] uppercase text-center mb-2 text-red">
            Be the first to know
          </div>
          <div className="flex gap-2 w-[320px] items-center justify-center">
            <div className="h-full pixel-corners">
              <input
                className="bg-[#4f6367] text-lg tracking-wide text-shadow-[2px_2px_0px_#16232590] p-4 outline-4 outline-offset-[-4px] outline-[#39474a] focus:outline-[#677c81]"
                type="email"
                placeholder="Enter your email..."
              />
            </div>
            <button className="group relative cursor-pointer w-[56px] h-[56px]">
              <Image
                className="absolute top-0 left-0 w-full h-full opacity-100 group-hover:opacity-0"
                src={`/go.png`}
                width={56}
                height={56}
                alt=""
              />
              <Image
                className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100"
                src={`/go-hover.png`}
                width={56}
                height={56}
                alt=""
              />
            </button>
          </div>
        </Box>
      </div>
      <Cards columns={1}>
        <Card>
          <div
            className="absolute top-0 left-0 w-full h-full"
            onClick={() => {
              const event = new CustomEvent("goHome");
              document.dispatchEvent(event);
            }}
          >
            <Image
              className="w-full h-full"
              src={`/joker.png`}
              width={138}
              height={186}
              alt=""
            />
          </div>
        </Card>
      </Cards>
      <div className="absolute bottom-0">
        <Footer />
      </div>
    </div>
  );
}
