"use client";

import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";

export default function Socials() {
  return (
    <div className="fixed bottom-0 right-0 m-4 pb-[6px] z-10">
      <Link
        className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] flex filter-[drop-shadow(0px_6px_0_#00000075)]"
        href={"https://www.instagram.com/blc_kk/"}
        target="_blank"
        onClick={(event) => {
          gsap.fromTo(
            event.target,
            { scale: 1.05 },
            { scale: 1.1, duration: 0.1, ease: "bounce" }
          );
        }}
        onMouseEnter={(event) => {
          gsap.to(event.target, { scale: 1.05, duration: 0.1 });
        }}
        onMouseLeave={(event) => {
          gsap.to(event.target, { scale: 1, duration: 0.1 });
        }}
      >
        <Image
          className="w-full h-full"
          src={`/icons/ig.png`}
          width={240}
          height={240}
          alt="Instagram"
        />
      </Link>
    </div>
  );
}
