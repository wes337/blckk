"use client";

import Link from "next/link";
import { gsap } from "gsap";

export default function ButtonLink({ label, href, color }) {
  const bg = () => {
    switch (color) {
      case "blue":
        return "bg-blue hover:bg-blue-dark active:bg-blue-dark";
      case "orange":
        return "bg-orange hover:bg-orange-dark active:bg-orange-dark";
      case "green":
        return "bg-green hover:bg-green-dark active:bg-green-dark";
      default:
        return "bg-dark hover:bg-darker active:bg-darker";
    }
  };

  return (
    <Link
      key={href}
      className={`h-full w-full filter-[drop-shadow(0px_6px_0_#00000075)]`}
      href={href}
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
      <div
        className={`pixel-corners flex w-full items-center justify-center py-2 xl:py-4 uppercase text-3xl text-shadow-[0px_4px_0px_#16232575] ${bg()}`}
      >
        {label}
      </div>
    </Link>
  );
}
