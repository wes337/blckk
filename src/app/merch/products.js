"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Shopify from "@/shopify";
import Cache from "@/cache";
import Cards from "@/components/cards";
import Card from "@/components/card";
import Footer from "@/components/footer";
import ShopSign from "@/components/shop-sign";
import EmailForm from "@/components/email-form";
import ProductView from "./product-view";
import ProductCard from "./product-card";
import Cart from "./cart";

const ENABLED = true;

export default function Products({ products }) {
  const searchParams = useSearchParams();
  const [cart, setCart] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const createShopifyCart = async () => {
      const cachedCartId = await Cache.getItem("cartId");
      const validCart = cachedCartId
        ? await Shopify.isCartValid(cachedCartId)
        : false;

      if (validCart) {
        const existingCart = await Shopify.getCart(cachedCartId);
        setCart(existingCart);
      } else {
        const cart = await Shopify.createCart();
        Cache.setItem("cartId", cart.id, 60);
        setCart(cart);
      }
    };

    createShopifyCart();
  }, []);

  useEffect(() => {
    const handle = searchParams.get("product");

    if (!handle) {
      setSelectedProduct(null);
      return;
    }

    const existingProduct = products.results.find(
      (product) => product.handle === handle
    );

    if (existingProduct) {
      setSelectedProduct(existingProduct);
    } else {
      Shopify.getProduct(handle).then((product) => setProduct(product));
    }
  }, [searchParams]);

  return (
    <>
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
      <ProductView product={selectedProduct} cart={cart} />
      <Cart
        cart={cart}
        open={cartOpen}
        setOpen={setCartOpen}
        hide={!!selectedProduct}
      />
    </>
  );
}
