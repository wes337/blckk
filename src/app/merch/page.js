import Cards from "@/components/cards";
import Footer from "@/components/footer";
import ShopSign from "@/components/shop-sign";
import Shopify from "@/shopify";
import ProductView from "./product-view";
import ProductCard from "./product-card";

const products = await Shopify.getProducts();

export default function MerchPage() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex flex-col gap-8 items-center justify-center z-10">
        <ShopSign />
        <Cards>
          {products.results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Cards>
        <div className="absolute bottom-0">
          <Footer />
        </div>
      </div>
      <ProductView />
    </>
  );
}
