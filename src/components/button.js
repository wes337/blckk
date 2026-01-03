"use client";

import { gsap } from "gsap";

export default function Button({ label, color, size, onClick }) {
  const bg = () => {
    switch (color) {
      case "blue":
        return "bg-blue hover:bg-blue-dark active:bg-blue-dark";
      case "orange":
        return "bg-orange hover:bg-orange-dark active:bg-orange-dark";
      case "green":
        return "bg-green hover:bg-green-dark active:bg-green-dark";
      case "red":
        return "bg-red hover:bg-red-dark active:bg-red-dark";
      default:
        return "bg-dark hover:bg-darker active:bg-darker";
    }
  };

  const textSize = () => {
    switch (size) {
      case "lg":
        return "text-3xl py-2 xl:py-4 ";
      case "sm":
        return "text-md py-0.5 xl:py-1";
      default:
        return "text-3xl py-2 xl:py-4";
    }
  };

  return (
    <button
      className={`cursor-pointer h-full w-full filter-[drop-shadow(0px_6px_0_#00000075)]`}
      onClick={(event) => {
        gsap.fromTo(
          event.target,
          { scale: 1.05 },
          { scale: 1.1, duration: 0.1, ease: "bounce" }
        );

        onClick();
      }}
      onMouseEnter={(event) => {
        gsap.to(event.target, { scale: 1.05, duration: 0.1 });
      }}
      onMouseLeave={(event) => {
        gsap.to(event.target, { scale: 1, duration: 0.1 });
      }}
    >
      <div
        className={`pixel-corners flex w-full min-w-[48px] items-center justify-center uppercase ${textSize()} text-shadow-[0px_4px_0px_#16232575] ${bg()}`}
      >
        {label}
      </div>
    </button>
  );
}
