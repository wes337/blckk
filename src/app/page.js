import Image from "next/image";
import ButtonLink from "@/components/button-link";

const LINKS = [
  { label: "Music", href: "/music", color: "blue" },
  { label: "Merch", href: "/merch", color: "orange" },
  { label: "Shows", href: "/shows", color: "green" },
];

export default function Home() {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-4 fixed top-[50%] left-[50%] translate-[-50%] max-w-[90vw] md:max-w-[33vw]">
        <Image
          className="w-full h-full drop-shadow-[0_0_8px_#ffffff95]"
          src={`/logo.png`}
          width={1416}
          height={545}
          alt="BLCKK"
        />
        <div className="flex flex-wrap xl:flex-nowrap items-center justify-between bg-darker p-6 gap-4 rounded-md shadow-[0px_6px_0px_0px_#162325]">
          {LINKS.map(({ label, href, color }) => {
            return (
              <ButtonLink key={href} label={label} color={color} href={href} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
