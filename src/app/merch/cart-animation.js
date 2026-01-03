"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { randomNumberBetween } from "@/utils";

export default function CartAnimation() {
  const container = useRef();
  const [rect, setRect] = useState(null);

  const createCard = (rect) => {
    const existingCard = document.getElementById("cart-card");

    if (existingCard) {
      return;
    }

    const img = document.createElement("img");
    img.id = "cart-card";
    img.src = "/card-back.png";
    img.width = 138;
    img.height = 186;
    img.style.transform = "rotate(-10deg)";
    img.style.translate = `${rect?.left || 0}px ${rect?.top || 0}px`;

    container.current.appendChild(img);

    gsap.to("#cart-card", {
      x: window.innerWidth + 200,
      y: -200,
      rotate: randomNumberBetween(0, 360),
      ease: "elastic",
      duration: 3,
      delay: 0.2,
      onComplete: () => {
        setRect(null);
        img.remove();
      },
    });

    setTimeout(() => {
      const tl = gsap.timeline();
      tl.to("#cart-button", { scale: 2.0, duration: 0.2 });
      tl.to("#cart-button", { scale: 1.0, duration: 0.2 });
    }, 500);

    setTimeout(() => {
      img?.remove?.();
    }, 2000);
  };

  useEffect(() => {
    let timeout;

    const cartAnimation = (event) => {
      const productHandle = event.detail;
      const productCard = document.getElementById(`product-${productHandle}`);
      const rect = productCard?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      setRect(rect);
      createCard(rect);
    };

    document.addEventListener("cartanimation", cartAnimation);

    return () => {
      document.removeEventListener("cartanimation", cartAnimation);

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <div
      ref={container}
      className={`fixed w-full h-full ${
        rect ? "opacity-100" : "opacity-0"
      } pointer-events-none z-99`}
    />
  );
}
