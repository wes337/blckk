"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ShopSign() {
  const container = useRef();
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((currentFrame) => {
        if (currentFrame >= 4) {
          return 1;
        }

        return currentFrame + 1;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useGSAP(
    () => {
      if (typeof window === "undefined") {
        return;
      }

      gsap.fromTo(
        ".shop-sign",
        {
          translateY: "100%",
        },
        { translateY: "0%", ease: "elastic", duration: 2 }
      );
    },
    { dependencies: [], scope: container }
  );

  return (
    <div ref={container}>
      <div className="shop-sign relative w-[228px] h-[114px]">
        <Image
          className={`absolute w-full h-full ${
            frame === 1 ? "opacity-100" : "opacity-0"
          }`}
          src={`/shop-1.png`}
          width={228}
          height={114}
          alt=""
        />
        <Image
          className={`absolute w-full h-full ${
            frame === 2 ? "opacity-100" : "opacity-0"
          }`}
          src={`/shop-2.png`}
          width={228}
          height={114}
          alt=""
        />
        <Image
          className={`absolute w-full h-full ${
            frame === 3 ? "opacity-100" : "opacity-0"
          }`}
          src={`/shop-3.png`}
          width={228}
          height={114}
          alt=""
        />
        <Image
          className={`absolute w-full h-full ${
            frame === 4 ? "opacity-100" : "opacity-0"
          }`}
          src={`/shop-4.png`}
          width={228}
          height={114}
          alt=""
        />
      </div>
    </div>
  );
}
