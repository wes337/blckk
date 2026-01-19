import Link from "next/link";
import Image from "next/image";
import Card from "@/components/card";

export default function ProductCard({ product }) {
  const longTitle = product.title.length > 16;
  const image = product.images[0];

  return (
    <Card>
      <Link
        id={`product-${product.handle}`}
        className="relative flex flex-col items-center h-full"
        href={`/merch?product=${product.handle}`}
      >
        {product.soldOut && (
          <div className="absolute top-[80px] left-[60px] translate-[-50%] uppercase text-red text-shadow-[2px_2px_0_#00000090] text-[28px] whitespace-nowrap z-1">
            Sold Out
          </div>
        )}
        <div className={`whitespace-nowrap ${longTitle ? "text-xs" : ""} z-1`}>
          {product.title}
        </div>
        <div className="h-full w-full">
          {image && (
            <Image
              className="h-full w-auto object-contain m-auto -mt-[20px] select-none"
              src={image}
              width={138}
              height={186}
              alt=""
            />
          )}
        </div>
        <div className="absolute bottom-[-4px] right-[-4px] text-yellow text-xl tracking-wide bg-darkest p-1 pixel-corners">
          <div className="pixel-corners bg-dark py-1 px-2 text-shadow-[4px_2px_0_#00000075]">
            ${Number(product.price).toFixed(2)}
          </div>
        </div>
      </Link>
    </Card>
  );
}
