"use client";

import { useRef } from "react";
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

export default function Logo() {
  const container = useRef();
  const pathname = usePathname();

  useGSAP(
    () => {
      if (typeof window === "undefined") {
        return;
      }

      gsap.to(".logo", {
        scale: pathname === "/" ? 1 : 0.5,
        ease: "elastic",
      });

      gsap.to(".links", {
        translateY: pathname === "/" ? 0 : "-500%",
        opacity: pathname === "/" ? 1 : 0,
        pointerEvents: pathname === "/" ? "all" : "none",
        ease: "elastic",
        duration: 1,
      });
    },
    { dependencies: [pathname], scope: container }
  );

  return (
    <div
      ref={container}
      className={`fixed ${
        pathname === "/"
          ? "top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          : "top-0 left-[50%] translate-x-[-50%]"
      } flex items-center justify-center transition-all duration-150`}
    >
      <div className={`flex flex-col items-center justify-center gap-4`}>
        <Link className="w-[75vw] md:w-[33vw]" href="/">
          <Image
            className="logo w-full h-full drop-shadow-[0_0_8px_#ffffff95]"
            src={`/logo.png`}
            width={1416}
            height={545}
            alt="BLCKK"
          />
        </Link>
        <div
          className={`links flex w-[75vw] md:w-[33vw] flex-wrap xl:flex-nowrap m-auto md:m-0 items-center justify-between bg-darker p-6 gap-4 rounded-md shadow-[0px_6px_0px_0px_#162325]`}
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
