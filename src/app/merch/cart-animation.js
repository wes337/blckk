"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function CartAnimation() {
  const container = useRef();
  const [animating, setAnimating] = useState(false);

  const createCard = (productHandle) => {
    const existingCard = document.getElementById("cart-card");

    if (existingCard) {
      return;
    }

    const card = document.getElementById(`product-${productHandle}`);
    const cardRect = card.getBoundingClientRect();
    const cartButton = document.getElementById("cart-button");
    const cartRect = cartButton?.getBoundingClientRect();

    const cartX = cartRect?.left ?? window.innerWidth - 50;
    const cartY = cartRect?.top - 64 ?? 50;

    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    const deltaX = cartX - cardCenterX;
    const deltaY = cartY - cardCenterY;
    const angleToCart = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    const rotationAngle = angleToCart + 90;

    const img = document.createElement("img");
    img.id = "cart-card";
    img.src = "/card-back.png";
    img.width = 138;
    img.height = 186;
    img.style.position = "fixed";
    img.style.left = "0";
    img.style.top = "0";
    img.style.transform = `translate(${cardRect.left}px, ${
      cardRect.top
    }px) rotate(${0}deg)`;

    container.current.appendChild(img);

    gsap.to("#cart-card", {
      x: cartX,
      y: cartY,
      scale: 0.1,
      rotate: rotationAngle,
      ease: "power2.inOut",
      duration: 0.5,
      onComplete: () => {
        setAnimating(null);
        img.remove();
      },
    });

    setTimeout(() => {
      const tl = gsap.timeline();
      tl.to("#cart-button", { scale: 2.0, duration: 0.1 });
      tl.to("#cart-button", { scale: 1.0, duration: 0.1 });
    }, 200);

    setTimeout(() => {
      img?.remove?.();
    }, 2000);
  };

  useEffect(() => {
    let timeout;

    const cartAnimation = (event) => {
      setAnimating(true);

      timeout = setTimeout(() => {
        createCard(event.detail);
      }, 500);
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
        animating ? "opacity-100" : "opacity-0"
      } pointer-events-none z-25`}
    />
  );
}
