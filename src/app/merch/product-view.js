"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
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

export default function ProductView({ cart, product }) {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);

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

    setDropdownOpen(false);
    setCurrentVariant(null);
    setCurrentImage(0);
    setShowSizeError(false);

    if (product) {
      show();
    } else {
      hide();
    }
  }, [initialized, product]);

  useEffect(() => {
    if (dropdownOpen) {
      gsap.fromTo(
        "#variant-dropdown",
        { bottom: "-100%" },
        {
          bottom: "0%",
          ease: "elastic.inOut",
          duration: 1,
        }
      );
    } else {
      gsap.fromTo(
        "#variant-dropdown",
        { bottom: "-0%" },
        {
          bottom: "-100%",
          ease: "elastic",
          duration: 1,
        }
      );
    }
  }, [dropdownOpen]);

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

  const handleSizeError = () => {
    setShowSizeError(true);

    setTimeout(() => {
      setShowSizeError(false);

      setTimeout(() => {
        setShowSizeError(true);

        setTimeout(() => {
          setShowSizeError(false);
        }, 500);
      }, 500);
    }, 500);
  };

  const onAddToCart = async () => {
    if (!cart || !product) {
      return;
    }

    if (hasSizes && !currentVariant) {
      handleSizeError();
      return;
    }

    const merchandiseId = currentVariant?.id || product.variants[0].id;

    await Shopify.addToCart(cart.id, [{ merchandiseId, quantity: 1 }]);

    const event = new CustomEvent("updatecart");
    document.dispatchEvent(event);

    router.push("/merch");
    // Do animation
  };

  const title = product?.title || "";
  const longTitle = title.length > 16;
  const images = product?.images || [];
  const variants = product?.variants || [];
  const hasSizes = variants.length > 1;
  const price = (() => {
    if (!product) {
      return "";
    }

    const selectedVariant = currentVariant
      ? product.variants.find(({ id }) => id === currentVariant.id)
      : null;

    return Number(selectedVariant?.price || product.price).toFixed(2);
  })();

  return (
    <>
      {initialized &&
        createPortal(
          <Link
            className={`group cursor-pointer fixed top-0 right-0 m-3 z-35 filter-[drop-shadow(0px_6px_0_#00000095)] ${
              product
                ? "translate-y-[0px] delay-500 opacity-100"
                : "translate-y-[-100px] pointer-events-none opacity-0"
            } transition-all duration-500`}
            href={`/merch`}
          >
            <Image
              className="w-[48px] h-[48px] md:w-full md:h-full"
              src={`/close.png`}
              width={64}
              height={64}
              alt=""
            />
            <Image
              className="absolute top-0 left-0 w-[48px] h-[48px] md:w-full md:h-full opacity-0 group-hover:opacity-100 transition-opacity duration-100"
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
            {images.length > 1 && (
              <div className="absolute top-0 left-0 w-full h-full flex justify-between">
                <button
                  id="previous-image"
                  className="relative group display flex items-center justify-start w-full h-full cursor-pointer"
                  onClick={() => {
                    const tl = gsap.timeline();

                    tl.to("#previous-image", { scale: 1.05, duration: 0.1 });
                    tl.to("#previous-image", { scale: 1.0, duration: 0.1 });

                    gotoPreviousImage();
                  }}
                >
                  <Image
                    className="scale-x-[-1]"
                    src={`/arrow-right.png`}
                    width={52}
                    height={32}
                    alt="Previous"
                  />
                  <Image
                    className={`scale-x-[-1] absolute top-[50%] translate-y-[-50%] left-0 opacity-0 group-hover:opacity-100`}
                    src={`/arrow-right-hover.png`}
                    width={52}
                    height={32}
                    alt="Previous"
                  />
                </button>
                <button
                  id="next-image"
                  className="relative group display flex items-center justify-end w-full h-full cursor-pointer"
                  onClick={() => {
                    const tl = gsap.timeline();

                    tl.to("#next-image", { scale: 1.05, duration: 0.1 });
                    tl.to("#next-image", { scale: 1.0, duration: 0.1 });

                    gotoNextImage();
                  }}
                >
                  <Image
                    src={`/arrow-right.png`}
                    width={52}
                    height={32}
                    alt="Next"
                  />
                  <Image
                    className={`absolute top-[50%] translate-y-[-50%] right-0 opacity-0 group-hover:opacity-100`}
                    src={`/arrow-right-hover.png`}
                    width={52}
                    height={32}
                    alt="Previous"
                  />
                </button>
              </div>
            )}
          </div>
          <div className="relative flex flex-col bg-white border-gray border-t-2 z-2 h-[17vh] md:h-auto">
            <div className="flex p-1">
              <button
                id="variant-dropdown-button"
                className={`cursor-pointer flex items-center justify-center ${
                  showSizeError
                    ? "bg-red text-red"
                    : "bg-darkest text-white text-shadow-[1px_1px_0px_#16232590] "
                } hover:bg-darkest/50 w-[200px] uppercase pixel-corners p-1 transition-all duration-200 z-3`}
                onMouseEnter={() => {
                  gsap.to("#variant-dropdown-button", {
                    scale: 1.05,
                    duration: 0.1,
                  });
                }}
                onMouseLeave={() => {
                  gsap.to("#variant-dropdown-button", {
                    scale: 1,
                    duration: 0.1,
                  });
                }}
                onClick={() => setDropdownOpen(true)}
              >
                <div
                  className={`flex items-center justify-center text-center h-full w-[98%] ${
                    showSizeError ? "bg-dark/90" : "bg-dark"
                  } pixel-corners text-lg`}
                >
                  {currentVariant?.title || "Select Size"}
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
                <Button
                  label="Add to Cart"
                  color="red"
                  size="md"
                  onClick={onAddToCart}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {initialized &&
        createPortal(
          <div
            id="variant-dropdown"
            className={`fixed bottom-[-100%] left-[50%] translate-x-[-50%] z-32 bg-darkest p-2 w-[95vw] md:w-[33vw] pixel-corners pb-[32px] mb-[-24px] ${
              dropdownOpen ? "" : "pointer-events-none"
            }`}
          >
            <div className="pixel-corners bg-dark">
              <div className="text-center uppercase p-1 text-sm text-white/75 tracking-wide">
                Select Size
              </div>
              <div className="flex flex-col p-2 gap-2">
                {variants.map((variant, index) => {
                  const selected = currentVariant?.id === variant.id;

                  return (
                    <button
                      key={`${variant.id}-${index}`}
                      className={`cursor-pointer pixel-corners ${
                        selected
                          ? "text-yellow bg-white/25"
                          : "text-white bg-white/15"
                      } p-2 hover:text-yellow hover:bg-white/33 hover:text-shadow-[2px_2px_0px_#00000050]`}
                      onMouseEnter={(event) => {
                        gsap.to(event.target, {
                          scale: 1.02,
                          duration: 0.1,
                        });
                      }}
                      onMouseLeave={(event) => {
                        gsap.to(event.target, {
                          scale: 1,
                          duration: 0.1,
                        });
                      }}
                      onClick={() => {
                        setCurrentVariant(variant);
                        setDropdownOpen(false);
                      }}
                    >
                      {variant.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body
        )}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black/50 ${
          dropdownOpen ? "z-31" : "z-25"
        } ${
          product ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-all duration-250 delay-250`}
      />
    </>
  );
}
