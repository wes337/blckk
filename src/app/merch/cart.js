"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import Shopify from "@/shopify";
import Button from "@/components/button";

export default function Cart({ cart, open, setOpen, hide }) {
  const [initialized, setInitialized] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setInitialized(true);
  }, []);

  const getShopifyCartItems = useCallback(async () => {
    if (!cart) {
      return;
    }

    const cartItems = await Shopify.getCartItems(cart.id);
    setCartItems(cartItems);
  }, [cart, setOpen]);

  useEffect(() => {
    document.addEventListener("updatecart", getShopifyCartItems);

    return () => {
      document.removeEventListener("updatecart", getShopifyCartItems);
    };
  }, [getShopifyCartItems]);

  useEffect(() => {
    if (!cart) {
      return;
    }

    getShopifyCartItems();
  }, [cart, getShopifyCartItems]);

  useEffect(() => {
    if (!cart || !open) {
      return;
    }

    getShopifyCartItems();
  }, [cart, open, getShopifyCartItems]);

  const subtotal = () => {
    let amount = 0;

    cartItems.forEach(({ price, quantity }) => {
      amount += Number(price) * Number(quantity);
    });

    return amount;
  };

  const onRemoveCartItem = async (cartItem) => {
    if (!cart) {
      return;
    }

    await Shopify.removeFromCart(cart.id, [cartItem.id]);
    await getShopifyCartItems();
  };

  const onClickCheckout = () => {
    if (!cart) {
      return;
    }

    window.location.href = cart.checkoutUrl;
  };

  return (
    <>
      <button
        id="cart-button"
        className={`cursor-pointer fixed top-0 right-0 m-3 z-10 filter-[drop-shadow(0px_6px_0_#00000095)] ${
          hide || cartItems.length === 0
            ? "translate-x-[100px] delay-200"
            : "translate-x-[0px]"
        } transition-all duration-200`}
        onClick={() => {
          const tl = gsap.timeline();

          tl.to("#cart-button", { scale: 1.5, duration: 0.1 });
          tl.to("#cart-button", { scale: 1.0, duration: 0.1 });

          setOpen(true);
        }}
        onMouseEnter={() => {
          gsap.to("#cart-button", {
            scale: 1.1,
            duration: 0.1,
          });
        }}
        onMouseLeave={() => {
          gsap.to("#cart-button", {
            scale: 1,
            duration: 0.1,
          });
        }}
      >
        <Image
          className="w-[48px] h-[48px] md:w-[64px] md:h-[64px]"
          src={`/cart.png`}
          width={64}
          height={64}
          alt="Shopping Cart"
        />
        {cartItems.length > 0 && (
          <div className="absolute bottom-[-8px] left-[-8px] z-2 bg-darkest/75 w-[28px] pixel-corners">
            {cartItems.length}
          </div>
        )}
      </button>
      {initialized &&
        createPortal(
          <div
            className={`fixed top-0 h-full w-full md:w-[33vw] flex flex-col bg-darker filter-[drop-shadow(-6px_0_0_#00000095)] z-30 ${
              open ? "right-0" : "right-[-110%] pointer-events-none"
            } transition-all duration-300`}
          >
            <div className="text-center p-5 text-2xl tracking-wide uppercase text-shadow-[0px_4px_0px_#16232575]">
              Shopping Cart
            </div>
            <button
              className={`group cursor-pointer absolute top-0 right-0 m-3 z-35 filter-[drop-shadow(0px_6px_0_#00000095)]`}
              onClick={() => setOpen(false)}
            >
              <Image
                className="w-[48px] h-[48px]"
                src={`/close.png`}
                width={64}
                height={64}
                alt=""
              />
              <Image
                className="absolute top-0 left-0 w-[48px] h-[48px] opacity-0 group-hover:opacity-100 transition-opacity duration-100"
                src={`/close-hover.png`}
                width={64}
                height={64}
                alt=""
              />
            </button>
            <div className="h-full w-full px-4">
              <div className="h-full w-full bg-darkest pixel-corners"></div>
            </div>
            <div className="w-full p-4">
              <Button
                label="Checkout"
                color="orange"
                onClick={onClickCheckout}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
