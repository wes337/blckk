import Link from "next/link";
import Image from "next/image";
import Card from "@/components/card";
import Cards from "@/components/cards";
import Footer from "@/components/footer";

const LINKS = [
  {
    id: "Spotify",
    icon: "/icons/spotify-card.png",
    href: "https://open.spotify.com/artist/4Zs1wgcjD3aYvaN1lFRMRt",
    textColor: "text-[#235955]",
  },
  {
    id: "Apple Music",
    icon: "/icons/apple-card.png",
    href: "https://music.apple.com/us/artist/blckk/1438248313",
    textColor: "text-[#f03464]",
  },
  {
    id: "YouTube",
    icon: "/icons/youtube.png",
    href: "https://www.youtube.com/@blckk0",
    textColor: "text-[#ff0000]",
  },
  {
    id: "Soundcloud",
    icon: "/icons/soundcloud-card.png",
    href: "https://soundcloud.com/blckk",
    textColor: "text-[#f06b3f]",
  },
];

export default async function MusicPage() {
  return (
    <div className="fixed top-0 left-0 flex flex-col gap-8 items-center justify-center w-full h-full m-auto z-10 overflow-auto">
      <div className="text-2xl text-shadow-[2px_2px_0px_#16232590] uppercase">
        Music
      </div>
      <Cards columns={2}>
        {LINKS.map((link) => {
          return (
            <Card key={link.id}>
              <Link
                className={`relative flex flex-col items-center justify-center w-full h-full ${link.textColor} text-shadow-none font-cards tracking-tight`}
                href={link.href}
                target="_blank"
              >
                <div className="absolute top-0 left-0">
                  <div className="text-md">{link.id}</div>
                  <Image
                    className="w-[15%] h-auto object-contain"
                    src={link.icon}
                    width={240}
                    height={240}
                    alt=""
                  />
                </div>
                <Image
                  className="w-[50%] h-auto object-contain"
                  src={link.icon}
                  width={240}
                  height={240}
                  alt=""
                />
                <div className="absolute bottom-0 left-0 scale-x-[-1] scale-y-[-1]">
                  <div className="text-md">{link.id}</div>
                  <Image
                    className="w-[15%] h-auto object-contain"
                    src={link.icon}
                    width={240}
                    height={240}
                    alt=""
                  />
                </div>
              </Link>
            </Card>
          );
        })}
      </Cards>
      <Footer fixed />
    </div>
  );
}
