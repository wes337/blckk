"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Cache from "@/cache";
import Box from "@/components/box";

export default function EmailForm({ onClose }) {
  const container = useRef();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    Cache.getItem("email-submitted").then((submitted) => {
      setSubmitted(submitted);
    });
  }, []);

  useGSAP(
    () => {
      if (typeof window === "undefined") {
        return;
      }

      gsap.fromTo(
        ".form",
        {
          translateY: "100%",
        },
        { translateY: "0%", ease: "elastic", duration: 2 },
      );
    },
    { dependencies: [], scope: container },
  );

  const onSubmit = async (event) => {
    event.preventDefault();

    if (loading || submitted) {
      return;
    }

    setLoading(true);

    const form = container.current.querySelector("form");
    const formData = new FormData(form);
    const email = formData.get("email");

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    setSubmitted(response.status === 204);
    setLoading(false);

    await Cache.setItem("email-submitted", true, 300);

    gsap.fromTo(
      ".form",
      {
        translateY: "0%",
        marginBottom: "0",
        opacity: 1,
      },
      {
        translateY: "100%",
        marginBottom: "-100%",
        opacity: 0,
        ease: "back.in",
        duration: 1,
        delay: 2,
        onComplete: () => {
          setHidden(true);
          onClose?.();
        },
      },
    );
  };

  if (hidden) {
    return null;
  }

  return (
    <div ref={container}>
      {onClose && (
        <button
          className={`group cursor-pointer fixed top-0 right-0 m-3 z-35 filter-[drop-shadow(0px_6px_0_#00000095)] transition-all duration-500`}
          onClick={onClose}
        >
          <Image
            className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] lg:h-[72px] lg:w-[72px]"
            src={`/close.png`}
            width={64}
            height={64}
            alt=""
          />
          <Image
            className="absolute top-0 left-0 w-[48px] h-[48px] md:w-[64px] md:h-[64px] lg:h-[72px] lg:w-[72px] opacity-0 group-hover:opacity-100 transition-opacity duration-100"
            src={`/close-hover.png`}
            width={64}
            height={64}
            alt=""
          />
        </button>
      )}
      <form
        className="form flex flex-col gap-2 items-center justify-center w-[320px]"
        onSubmit={onSubmit}
      >
        {submitted ? (
          <Box>
            <div className="text-lg text-shadow-[2px_2px_0px_#16232590] uppercase text-center mb-2 text-red">
              Thanks!
            </div>
            <div className="text-md text-shadow-[2px_2px_0px_#16232590] text-center mb-2 text-white">
              We&apos;ll let you know when new shows and products are announced.
            </div>
          </Box>
        ) : (
          <Box>
            <div className="text-lg text-shadow-[2px_2px_0px_#16232590] uppercase text-center mb-2 text-red">
              Be the first to know
            </div>
            <div className="flex gap-2 w-[320px] items-center justify-center">
              <div className="h-full pixel-corners">
                <input
                  className="bg-[#4f6367] text-lg tracking-wide text-shadow-[2px_2px_0px_#16232590] p-4 outline-4 outline-offset-[-4px] outline-[#39474a] focus:outline-[#677c81]"
                  type="email"
                  name="email"
                  placeholder="Enter your email..."
                  required
                />
              </div>
              <button
                className={`group relative w-[56px] h-[56px] ${
                  loading ? "brightness-50" : "cursor-pointer"
                }`}
                disabled={loading}
              >
                <Image
                  className="absolute top-0 left-0 w-full h-full opacity-100 group-hover:opacity-0"
                  src={`/go.png`}
                  width={56}
                  height={56}
                  alt=""
                />
                <Image
                  className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100"
                  src={`/go-hover.png`}
                  width={56}
                  height={56}
                  alt=""
                />
              </button>
            </div>
          </Box>
        )}
      </form>
    </div>
  );
}
