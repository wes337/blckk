"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { randomNumberBetween } from "@/utils";
import ButtonLink from "@/components/button-link";
import { createPortal } from "react-dom";
import Box from "./box";

gsap.registerPlugin(useGSAP);

const LINKS = [
  { label: "Music", href: "/music", color: "blue" },
  { label: "Merch", href: "/merch", color: "orange" },
  { label: "Shows", href: "/shows", color: "green" },
];

export default function Navigation() {
  const container = useRef();
  const router = useRouter();
  const pathname = usePathname();
  const [home, setHome] = useState(pathname === "/");

  const goHome = () => {
    const cards = gsap.utils.toArray(".card");

    const shopSign = document.querySelector(".shop-sign");

    if (shopSign) {
      gsap.fromTo(
        shopSign,
        {
          translateY: "0%",
        },
        { translateY: "-1000%", ease: "back.inOut", duration: 1 }
      );
    }

    if (cards && cards.length > 0) {
      cards.forEach((card, i) => {
        gsap.to(card, {
          ease: "bounce",
          rotateY: 180,
          delay: i * 0.1,
        });

        gsap.to(card, {
          ease: "bounce.in",
          width: 0,
          height: 0,
          rotateZ: randomNumberBetween(-10, 10),
          duration: 0.5,
          delay: i * 0.1,
          onComplete: () => {
            if (i === cards.length - 1) {
              router.push("/");
            }
          },
        });
      });
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    setHome(pathname === "/");
  }, [pathname]);

  useEffect(() => {
    document.addEventListener("goHome", goHome);

    return () => {
      document.removeEventListener("goHome", goHome);
    };
  }, [goHome]);

  useGSAP(
    () => {
      if (typeof window === "undefined") {
        return;
      }

      gsap.to(".logo", {
        scale: home ? 1 : 0.5,
        duration: 1.8,
        ease: "elastic",
      });

      gsap.to(".links", {
        translateY: home ? 0 : "-500%",
        opacity: home ? 1 : 0,
        ease: "elastic",
        duration: 1,
      });
    },
    { dependencies: [home], scope: container }
  );

  return (
    <>
      <div
        ref={container}
        className={`fixed ${
          home
            ? "top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
            : "top-0 left-[50%] translate-x-[-50%]"
        } flex items-center justify-center transition-all duration-150 pointer-events-none z-25`}
      >
        <div
          className={`flex flex-col items-center justify-center gap-8 -mt-4 md:mt-0 ${
            home ? "pb-[220px] md:pb-[196px]" : ""
          }`}
        >
          <button
            id="logo"
            className="w-[75vw] md:w-[33vw] cursor-pointer pointer-events-auto"
            onClick={goHome}
          >
            <Image
              className="logo w-full h-full drop-shadow-[0_0_8px_#ffffff95]"
              src={`/logo.png`}
              width={1416}
              height={545}
              alt="BLCKK"
            />
          </button>
          <div
            className={`links w-full h-full ${
              home ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <Box
              className={`flex w-[75vw] md:w-[33vw] flex-wrap xl:flex-nowrap m-auto md:m-0 items-center justify-between gap-4`}
            >
              {LINKS.map(({ label, href, color }) => {
                return (
                  <ButtonLink
                    key={href}
                    label={label}
                    color={color}
                    href={href}
                  />
                );
              })}
            </Box>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-[12px] md:top-[16px] ${
          home ? "left-[-100%]" : "left-[12px] md:left-[16px]"
        } transition-all duration-500 z-20 filter-[drop-shadow(0_4px_0_#00000075)]`}
        onClick={goHome}
      >
        <ButtonLink label="<" color="red" href="#" />
      </div>
    </>
  );
}
