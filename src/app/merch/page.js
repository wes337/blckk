import Card from "@/components/card";
import Cards from "@/components/cards";
import Footer from "@/components/footer";
import ShopSign from "@/components/shop-sign";

export default function MerchPage() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col gap-8 items-center justify-center z-10">
      <ShopSign />
      <Cards>
        <Card>Card 1</Card>
        <Card>Card 2</Card>
        <Card>Card 3</Card>
        <Card>Card 4</Card>
      </Cards>
      <div className="absolute bottom-0">
        <Footer />
      </div>
    </div>
  );
}
