"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { randomNumberBetween } from "@/utils";

export default function Card({ children, onClick }) {
  const cardRef = useRef();
  const [animating, setAnimating] = useState(false);
  const initialRotation = useRef(randomNumberBetween(-3, 3));

  useEffect(() => {
    if (cardRef.current) {
      gsap.set(cardRef.current, { rotateZ: initialRotation.current });
    }

    return () => {
      if (cardRef.current) {
        gsap.killTweensOf(cardRef.current);
      }
    };
  }, []);

  const onHoverOn = useCallback(() => {
    if (animating || !cardRef.current) {
      return;
    }
    setAnimating(true);

    gsap.to(cardRef.current, {
      rotateZ: 0,
      scale: 1.2,
      ease: "elastic.out(1, 0.5)",
      duration: 0.4,
      force3D: true,
      onComplete: () => setAnimating(false),
    });
  }, [animating]);

  const onHoverOff = useCallback(() => {
    if (!cardRef.current) {
      return;
    }

    gsap.to(cardRef.current, {
      rotateZ: initialRotation.current,
      scale: 1,
      ease: "elastic.out(1, 0.5)",
      duration: 0.4,
      force3D: true,
    });
  }, []);

  return (
    <div
      className={`relative flex items-center justify-center w-[138px] h-[186px] p-1 perspective-distant drop-shadow-[4px_4px_0px_#16232595] hover:drop-shadow-[8px_16px_0px_#16232599]`}
      onClick={onClick}
      onMouseEnter={onHoverOn}
      onMouseLeave={onHoverOff}
    >
      <div
        ref={cardRef}
        className="card relative transform-3d rotate-y-180 rotate-z-0 rotate-x-0 w-[0px] h-[0px] will-change-transform"
      >
        <div className="absolute top-0 left-0 w-full h-full">
          <Image src={`/card-back.png`} width={138} height={186} alt="" />
        </div>
        <div className="absolute top-0 left-0 w-full h-full backface-hidden bg-[url('/card-front.png')] bg-size-[100%_186px] rotate-x-0">
          <div className="p-1.5 h-full w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
