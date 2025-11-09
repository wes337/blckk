"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Shopify from "@/shopify";

export default function ProductView() {
  const searchParams = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const handle = searchParams.get("product");

    if (!handle) {
      setProduct(null);
    } else {
      Shopify.getProduct(handle).then((product) => setProduct(product));
    }

    setInitialized(true);
  }, [searchParams]);

  useGSAP(
    () => {
      if (!initialized || typeof window === "undefined") {
        return;
      }

      const show = {
        top: "100%",
        left: "50%",
        translateY: "-95%",
        translateX: "-50%",
        pointerEvents: "all",
      };

      const hide = {
        top: "100%",
        left: "50%",
        translateY: "25%",
        translateX: "-50%",
      };

      const from = product ? hide : show;
      const to = product ? show : hide;

      const tl = gsap.timeline();

      if (product) {
        tl.to("#product-view", {
          opacity: 1,
          pointerEvents: "none",
        });
      }

      tl.fromTo("#product-view", from, {
        ...to,
        ease: "elastic",
        duration: 1,
      });

      if (!product) {
        tl.to("#product-view", {
          opacity: 0,
        });
      }
    },
    { dependencies: [initialized, product] }
  );

  return (
    <>
      <div
        id="product-view"
        className={`fixed h-[100vh] w-[95vw] md:w-[50vw] z-30 bg-darkest pixel-corners-large p-4`}
      >
        Product view
        <Link
          className="group cursor-pointer absolute top-0 right-0 m-8 filter-[drop-shadow(0px_6px_0_#00000095)]"
          href={`/merch`}
        >
          <Image src={`/close.png`} width={64} height={64} alt="" />
          <Image
            className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-100"
            src={`/close-hover.png`}
            width={64}
            height={64}
            alt=""
          />
        </Link>
      </div>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black/50 z-25 ${
          product ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-all duration-250 delay-250`}
      />
    </>
  );
}
