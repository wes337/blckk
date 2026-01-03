import { Suspense } from "react";
import Shopify from "@/shopify";
import Products from "./products";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function MerchPage() {
  const products = await Shopify.getProducts();

  return (
    <Suspense>
      <Products products={products} />
    </Suspense>
  );
}
