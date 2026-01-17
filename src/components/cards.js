"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { randomNumberBetween } from "@/utils";

const GRID_COLS = {
  sm: {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  },
  md: {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
  },
  lg: {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
  },
};

export default function Cards({ columns = { sm: 2, md: 2, lg: 2 }, children }) {
  const container = useRef();
  const [animating, setAnimating] = useState(false);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

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
          0,
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
          "<",
        );
      });

      tl.play().then(() => setAnimating(false));
    },
    { dependencies: [], scope: container },
  );

  const gridCols =
    typeof columns === "number"
      ? GRID_COLS.sm[columns]
      : Object.entries(columns)
          .map(([breakpoint, count]) => GRID_COLS[breakpoint]?.[count])
          .filter(Boolean)
          .join(" ");

  return (
    <div
      ref={container}
      className={`grid ${gridCols} gap-8 text-darkest text-shadow-[1px_1px_0px_#16232590] ${
        animating ? "pointer-events-none" : "pointer-events-auto"
      } cursor-pointer`}
      onTouchStart={(event) => animating && event.preventDefault()}
      onMouseEnter={(event) => animating && event.preventDefault()}
    >
      {children}
    </div>
  );
}
