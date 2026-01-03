"use client";

import { useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Deck({ amount = 10 }) {
  const container = useRef();
  const router = useRouter();
  const pathname = usePathname();

  useGSAP(
    () => {
      if (typeof window === "undefined") {
        return;
      }

      gsap.fromTo(
        ".deck",
        {
          top: pathname === "/" ? "50%" : "90%",
          left: pathname === "/" ? "50%" : "50%",
          translateX: pathname === "/" ? "-72.5px" : "-72.5px",
          translateY: pathname === "/" ? "0px" : "-186px",
        },
        {
          top: pathname === "/" ? "90%" : "50%",
          left: pathname === "/" ? "50%" : "50%",
          translateX: pathname === "/" ? "-72.5px" : "-72.5px",
          translateY: pathname === "/" ? "-186px" : "0px",
          ease: "elastic.inOut(1,0.5)",
          duration: 0.8,
        }
      );

      const cards = gsap.utils.toArray(".deck-card");

      cards.forEach((card, index) => {
        gsap.to(card, {
          translateY: pathname === "/" ? -index : -100 - index,
          ease: "elastic.inOut",
          delay: index * 0.05,
        });
      });
    },
    { dependencies: [pathname], scope: container }
  );

  return (
    <div
      ref={container}
      className={`w-[143px] h-[186px] fixed top-0 left-0 w-full h-full pointer-events-none fade-in`}
    >
      <div className="deck relative top-[90%] left-[50%] translate-x-[-72.5px] translate-y-[-186px]">
        {[...Array(amount)].map((_, index) => {
          const isTopCard = index === amount - 1;

          return (
            <div
              key={index}
              className={`deck-card absolute ${
                isTopCard
                  ? "pointer-events-auto"
                  : "brightness-50 pointer-events-none"
              }`}
              style={{ translate: `${index * 0.5}px ${index * -1}px` }}
              onClick={() => {
                if (!isTopCard) {
                  return;
                }

                router.push(pathname === "/" ? "/merch" : "/");
              }}
            >
              <Image src={`/card-back.png`} alt="" width={138} height={186} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
