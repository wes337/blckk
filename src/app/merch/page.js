import { Suspense } from "react";
import Products from "./products";

export default function MerchPage() {
  return (
    <Suspense>
      <Products />
    </Suspense>
  );
}
