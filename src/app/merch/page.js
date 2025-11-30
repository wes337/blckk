"use client";

import { Suspense, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Shopify from "@/shopify";
import Cards from "@/components/cards";
import Card from "@/components/card";
import Footer from "@/components/footer";
import ShopSign from "@/components/shop-sign";
import Box from "@/components/box";
import ProductView from "./product-view";
import ProductCard from "./product-card";

const ENABLED = false;

const products = await Shopify.getProducts();

export default function MerchPage() {
  const container = useRef();

  useGSAP(
    () => {
      if (typeof window === "undefined") {
        return;
      }

      gsap.fromTo(
        ".coming-soon",
        {
          translateY: "300%",
        },
        { translateY: "-200%", ease: "elastic", duration: 2 }
      );
    },
    { dependencies: [], scope: container }
  );

  return (
    <Suspense>
      <div
        ref={container}
        className="fixed top-0 left-0 w-full h-full flex flex-col gap-8 items-center justify-center z-10"
      >
        <ShopSign />
        {ENABLED ? (
          <Cards>
            {products.results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Cards>
        ) : (
          <>
            <div className="coming-soon absolute bottom-0 z-1 translate-y-[-200%]">
              <Box>
                <div className="text-3xl text-shadow-[2px_2px_0px_#162325] uppercase text-center text-yellow tracking-wide">
                  Coming Soon
                </div>
              </Box>
            </div>
            <Cards columns={1}>
              <Card>
                <div
                  className="absolute top-0 left-0 w-full h-full"
                  onClick={() => {
                    const event = new CustomEvent("goHome");
                    document.dispatchEvent(event);
                  }}
                >
                  <Image
                    className="w-full h-full"
                    src={`/joker.png`}
                    width={138}
                    height={186}
                    alt=""
                  />
                </div>
              </Card>
            </Cards>
          </>
        )}

        <div className="absolute bottom-0">
          <Footer />
        </div>
      </div>
      <ProductView />
    </Suspense>
  );
}
