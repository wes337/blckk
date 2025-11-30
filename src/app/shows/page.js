"use client";

import Image from "next/image";
import Card from "@/components/card";
import Cards from "@/components/cards";
import Footer from "@/components/footer";
import ShowsList from "./shows-list";
import EmailForm from "./email-form";

export default function ShowsPage() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col gap-8 items-center justify-center z-10">
      <div className="text-2xl text-shadow-[2px_2px_0px_#16232590] uppercase -mb-2">
        Shows
      </div>
      <ShowsList />
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
      <div className="absolute bottom-0">
        <Footer />
      </div>
    </div>
  );
}
