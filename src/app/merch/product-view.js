"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Shopify from "@/shopify";
import Button from "@/components/button";

const SHOW_PRODUCT_ANIMATION_PARAMS = {
  top: "100%",
  left: "50%",
  translateY: "-95%",
  translateX: "-50%",
  pointerEvents: "all",
  opacity: 1,
};

const HIDE_PRODUCT_ANIMATION_PARAMS = {
  top: "100%",
  left: "50%",
  translateY: "25%",
  translateX: "-50%",
  opacity: 0,
};

export default function ProductView({ product }) {
  const [initialized, setInitialized] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [variant, setVariant] = useState(null);

  const show = () => {
    const from = HIDE_PRODUCT_ANIMATION_PARAMS;
    const to = SHOW_PRODUCT_ANIMATION_PARAMS;

    const tl = gsap.timeline();

    tl.to("#product-view", {
      opacity: 1,
      pointerEvents: "none",
    });

    tl.fromTo("#product-view", from, {
      ...to,
      ease: "elastic",
      duration: 1,
    });
  };

  const hide = () => {
    const from = SHOW_PRODUCT_ANIMATION_PARAMS;
    const to = HIDE_PRODUCT_ANIMATION_PARAMS;

    const tl = gsap.timeline();

    tl.fromTo("#product-view", from, {
      ...to,
      ease: "elastic",
      duration: 1,
      opacity: 1,
    });

    tl.to("#product-view", {
      opacity: 0,
    });
  };

  useEffect(() => {
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (product) {
      show();
    } else {
      hide();
    }
  }, [initialized, product]);

  const gotoNextImage = () => {
    if (!product) {
      return;
    }

    setCurrentImage((currentImage) => {
      const nextImage = currentImage + 1;

      if (nextImage > product.images.length - 1) {
        return 0;
      }

      return nextImage;
    });
  };

  const gotoPreviousImage = () => {
    if (!product) {
      return;
    }

    setCurrentImage((currentImage) => {
      const previousImage = currentImage - 1;

      if (previousImage < 0) {
        return product.images.length - 1;
      }

      return previousImage;
    });
  };

  const title = product?.title || "";
  const longTitle = title.length > 16;
  const images = product?.images || [];
  const price = (() => {
    if (!product) {
      return "";
    }

    const selectedVariant = variant
      ? product.variants.find(({ id }) => id === variant.id)
      : null;

    return Number(selectedVariant?.price || product.price).toFixed(2);
  })();

  console.log(product);

  return (
    <>
      {initialized &&
        createPortal(
          <Link
            className={`group cursor-pointer fixed top-0 right-0 m-3 z-30 filter-[drop-shadow(0px_6px_0_#00000095)] ${
              product
                ? "translate-y-[0px] delay-500 opacity-100"
                : "translate-y-[-100px] pointer-events-none opacity-0"
            } transition-all duration-500`}
            href={`/merch`}
          >
            <Image
              className="w-[48px] h-[48px] md:w-full h:h-full"
              src={`/close.png`}
              width={64}
              height={64}
              alt=""
            />
            <Image
              className="absolute top-0 left-0 w-[48px] h-[48px] md:w-full h:h-full opacity-0 group-hover:opacity-100 transition-opacity duration-100"
              src={`/close-hover.png`}
              width={64}
              height={64}
              alt=""
            />
          </Link>,
          document.body
        )}
      <div
        id="product-view"
        className={`fixed h-[100vh] w-[95vw] md:w-[50vw] z-30 bg-gray pixel-corners-large p-2`}
      >
        <div className="h-full w-full pixel-corners-large bg-white">
          <div
            className={`flex items-center text-darkest text-shadow-[1px_1px_0px_#16232590] h-[60px] p-3 border-gray border-b-2 ${
              longTitle ? "text-2xl" : "text-3xl"
            }`}
          >
            <Image
              className="w-[32px] h-[32px] mr-2 filter-[drop-shadow(1px_1px_0_#00000010)]"
              src={`/club.png`}
              width={32}
              height={32}
              alt=""
            />
            {title}
          </div>
          <div className="relative w-full max-[376px]:h-[68.5%] h-[70%] min-[1920px]:h-[75%] bg-gray/50">
            {images.map((image, index) => {
              return (
                <Image
                  key={image}
                  className={`${
                    index === 0 ? "" : "absolute top-0 left-0"
                  } w-full h-full ${
                    currentImage === index ? "visible" : "invisible"
                  } object-contain`}
                  src={image}
                  alt=""
                  width={447}
                  height={559}
                />
              );
            })}
          </div>
          <div className="relative flex flex-col bg-white border-gray border-t-2 z-2 h-[17vh] md:h-auto">
            <div className="flex p-1">
              <button
                className="cursor-pointer flex items-center justify-center bg-darkest hover:bg-darkest/50 w-[200px] text-white text-shadow-[1px_1px_0px_#16232590] uppercase pixel-corners p-1 transition-all duration-200 z-3"
                onMouseEnter={(event) => {
                  gsap.to(event.target, {
                    scale: 1.05,
                    duration: 0.1,
                  });
                }}
                onMouseLeave={(event) => {
                  gsap.to(event.target, {
                    scale: 1,
                    duration: 0.1,
                  });
                }}
              >
                <div className="flex items-center justify-center text-center h-full w-[98%] bg-dark pixel-corners text-lg">
                  Select Size
                </div>
              </button>
              <div className="ml-auto text-yellow text-3xl tracking-wide bg-darkest p-1 pixel-corners -mt-4">
                <div className="pixel-corners bg-dark py-1 px-2 text-shadow-[4px_2px_0_#00000075]">
                  ${price}
                </div>
              </div>
            </div>
            <div className="p-1 my-auto">
              <div className="flex bg-darkest/50 p-1 pixel-corners">
                <Button label="Add to Cart" color="red" size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black/50 z-25 ${
          product ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-all duration-250 delay-250`}
      />
    </>
  );
}
