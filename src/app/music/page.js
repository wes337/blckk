import Image from "next/image";
import Card from "@/components/card";
import Cards from "@/components/cards";
import Footer from "@/components/footer";
import data from "./data.json";

export default async function MusicPage() {
  const albums = data.filter((data) => data.type === "album");

  return (
    <div className="fixed top-0 left-0 w-full h-full m-auto pt-[120px] min-[1920px]:pt-[248px] z-10 overflow-auto">
      <div className="flex justify-center">
        <Cards>
          {albums.map((album) => {
            return (
              <Card key={album.id}>
                <div className="relative flex flex-col items-center justify-center w-full h-full text-shadow-[1px_1px_0_#00000050] text-center">
                  <Image
                    className="w-full h-auto object-contain border-2 border-gray"
                    src={album.images[0].url}
                    width={album.images[0].width}
                    height={album.images[0].height}
                    alt=""
                  />
                  <div className="text-sm mt-2 leading-none">{album.name}</div>
                </div>
              </Card>
            );
          })}
        </Cards>
      </div>
      <Footer />
    </div>
  );
}
