"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { randomNumberBetween } from "@/utils";

export default function Card({ children }) {
  const container = useRef();
  const [animating, setAnimating] = useState(false);
  const [_touch, setTouch] = useState(false);

  const onHoverOn = () => {
    if (animating || !container.current) {
      return;
    }

    setAnimating(true);

    const card = container.current.querySelector(".card");

    gsap.to(card, {
      rotateZ: 0,
      scale: 1.2,
      ease: "elastic",
      duration: 0.001,
      onComplete: () => setAnimating(false),
    });
  };

  const onHoverOff = () => {
    if (animating || !container.current) {
      return;
    }

    setAnimating(true);

    const card = container.current.querySelector(".card");

    gsap.to(card, {
      rotateZ: randomNumberBetween(-3, 3),
      scale: 1,
      ease: "elastic",
      duration: 0.001,
      onComplete: () => setAnimating(false),
    });
  };

  return (
    <div
      ref={container}
      className={`flex items-center justify-center w-[138px] h-[186px] p-1 perspective-distant drop-shadow-[2px_4px_1px_#16232590]`}
      onTouchStart={() => {
        setTouch((touch) => {
          const nextTouch = !touch;

          if (nextTouch) {
            onHoverOn();
          } else {
            onHoverOff();
          }

          return nextTouch;
        });
      }}
      onMouseEnter={onHoverOn}
      onMouseLeave={onHoverOff}
    >
      <div className="card relative transition-transform duration-500 transform-3d rotate-y-180 rotate-z-0 w-[0px] h-[0px]">
        <div className="absolute top-0 left-0 w-full h-full">
          <Image src={`/card-back.png`} width={138} height={186} alt="" />
        </div>
        <div className="absolute top-0 left-0 w-full h-full backface-hidden bg-[url('/card-front.png')] bg-size-[100%_186px]">
          <div className="p-1.5">{children}</div>
        </div>
      </div>
    </div>
  );
}
