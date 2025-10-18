"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ButtonLink from "@/components/button-link";

gsap.registerPlugin(useGSAP);

const LINKS = [
  { label: "Music", href: "/music", color: "blue" },
  { label: "Merch", href: "/merch", color: "orange" },
  { label: "Shows", href: "/shows", color: "green" },
];

export default function Navigation() {
  const container = useRef();
  const pathname = usePathname();
  const [home, setHome] = useState(pathname === "/");

  useEffect(() => {
    setHome(pathname === "/");
  }, [pathname]);

  useGSAP(
    () => {
      if (typeof window === "undefined") {
        return;
      }

      gsap.to(".logo", {
        scale: home ? 1 : 0.5,
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
    <div
      ref={container}
      className={`fixed ${
        home
          ? "top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          : "top-0 left-[50%] translate-x-[-50%]"
      } flex items-center justify-center transition-all duration-150 pointer-events-none z-25`}
    >
      <div
        className={`flex flex-col items-center justify-center gap-8 ${
          home ? "pb-[196px]" : ""
        }`}
      >
        <Link className="w-[75vw] md:w-[33vw] pointer-events-auto" href="/">
          <Image
            className="logo w-full h-full drop-shadow-[0_0_8px_#ffffff95]"
            src={`/logo.png`}
            width={1416}
            height={545}
            alt="BLCKK"
          />
        </Link>
        <div
          className={`links flex w-[75vw] md:w-[33vw] flex-wrap xl:flex-nowrap m-auto md:m-0 items-center justify-between bg-darker p-4 md:p-6 gap-4 rounded-md shadow-[0px_6px_0px_0px_#162325] ${
            home ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          {LINKS.map(({ label, href, color }) => {
            return (
              <ButtonLink key={href} label={label} color={color} href={href} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
