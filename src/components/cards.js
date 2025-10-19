"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { randomNumberBetween } from "@/utils";

export default function Cards({ columns = 2, children }) {
  const container = useRef();
  const [animating, setAnimating] = useState(false);

  useGSAP(
    () => {
      if (typeof window === "undefined") {
        return;
      }

      setAnimating(true);

      const cards = gsap.utils.toArray(".card");

      const tl = gsap.timeline();

      cards.forEach((card, index) => {
        tl.to(
          card,
          {
            width: 138,
            height: 186,
            ease: "bounce.out",
            duration: 0.5,
            delay: 1 + index * 0.1,
          },
          0
        );

        tl.to(
          card,
          {
            ease: "bounce",
            rotateY: 0,
            rotateZ: randomNumberBetween(-3, 3),
            delay: index * 0.1,
            duration: 0.5,
          },
          "<"
        );
      });

      tl.play().then(() => {
        setAnimating(false);
      });
    },
    { dependencies: [], scope: container }
  );

  const cols = () => {
    switch (columns) {
      case 5:
        return "grid-cols-5";
      case 4:
        return "grid-cols-4";
      case 3:
        return "grid-cols-3";
      case 2:
        return "grid-cols-2";
      default:
        return "grid-cols-2";
    }
  };

  return (
    <div
      ref={container}
      className={`grid grid-cols-2 xl:grid-cols-3 gap-8 text-darkest text-shadow-[1px_1px_0px_#16232590] ${
        animating ? "pointer-events-none" : "pointer-events-auto"
      } cursor-pointer`}
      onTouchStart={(event) => {
        if (animating) {
          event.preventDefault();
        }
      }}
      onMouseEnter={(event) => {
        if (animating) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </div>
  );
}
