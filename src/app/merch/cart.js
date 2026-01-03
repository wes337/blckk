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
          <>
            <div
              className={`fixed top-0 left-0 w-full h-full z-25 bg-black/75 ${
                open ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setOpen(false)}
            />
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
              <div className="h-full w-full px-4 overflow-y-auto">
                <div className="h-full w-full bg-darkest pixel-corners overflow-auto">
                  {cartItems.map((cartItem) => {
                    return (
                      <div
                        key={cartItem.id}
                        className="flex p-4 gap-2 hover:bg-white/5"
                      >
                        <div className="relative w-[48px] h-[48px]">
                          <span className="text-xs text-yellow text-shadow-[2px_2px_0px_#00000090] absolute bottom-[-4px] left-[-4px] z-1">
                            {Math.max(cartItem.quantity, 1)}x
                          </span>
                          <Image
                            className="w-full h-full object-cover pixel-corners"
                            src={cartItem.image}
                            alt=""
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="my-auto">
                          <div className="tracking-wider">
                            {cartItem.productTitle}
                          </div>
                          <div className="text-sm text-white/80 tracking-wide">
                            {cartItem.variantTitle === "Default Title"
                              ? ""
                              : cartItem.variantTitle}
                          </div>
                        </div>
                        <div className="my-auto ml-auto">
                          ${(cartItem.price * cartItem.quantity).toFixed(2)}
                        </div>
                        <button
                          className="cursor-pointer w-[40px] h-[40px] my-auto"
                          onClick={() => onRemoveCartItem(cartItem)}
                        >
                          <Image
                            src={`/remove.png`}
                            alt="Remove"
                            width={64}
                            height={64}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="px-4 py-2 ml-auto uppercase text-shadow-[0px_4px_0px_#16232575]">
                Subtotal ${subtotal().toFixed(2)}
              </div>
              <div className="w-full px-2 pb-4">
                <Button
                  label="Checkout"
                  color="orange"
                  onClick={onClickCheckout}
                />
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
