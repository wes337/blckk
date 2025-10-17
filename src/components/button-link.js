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
      className={`flex w-full items-center justify-center py-4 uppercase ${bg()} text-4xl text-shadow-[0px_4px_0px_#16232575] shadow-[0px_4px_0px_0px_#162325] rounded-md`}
      href={href}
      onClick={(event) => {
        gsap.fromTo(
          event.target,
          { scale: 1.05 },
          { scale: 1.1, ease: "elastic" }
        );
      }}
      onMouseEnter={(event) => {
        gsap.to(event.target, { scale: 1.05, ease: "elastic" });
      }}
      onMouseLeave={(event) => {
        gsap.to(event.target, { scale: 1, ease: "elastic" });
      }}
    >
      {label}
    </Link>
  );
}
