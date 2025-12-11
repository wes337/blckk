"use client";

import { Suspense } from "react";
import Image from "next/image";
import Shopify from "@/shopify";
import Cards from "@/components/cards";
import Card from "@/components/card";
import Footer from "@/components/footer";
import ShopSign from "@/components/shop-sign";
import EmailForm from "@/components/email-form";
import ProductView from "./product-view";
import ProductCard from "./product-card";

const ENABLED = true;

const products = await Shopify.getProducts();

export default function MerchPage() {
  return (
    <Suspense>
      <div className="fixed top-0 left-0 w-full h-full flex flex-col gap-8 items-center justify-center z-10">
        <ShopSign />
        {ENABLED ? (
          <Cards>
            {products.results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Cards>
        ) : (
          <>
            <EmailForm />
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
