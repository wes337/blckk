import Card from "@/components/card";
import Cards from "@/components/cards";
import Footer from "@/components/footer";

export default function MerchPage() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col gap-8 items-center justify-center z-10">
      <div className="text-2xl text-shadow-[2px_2px_0px_#16232590] uppercase">
        Merch
      </div>
      <Cards>
        <Card>Card 1</Card>
        <Card>Card 2</Card>
        <Card>Card 3</Card>
        <Card>Card 4</Card>
        <Card>Card 5</Card>
        <Card>Card 6</Card>
      </Cards>
      <div className="absolute bottom-0">
        <Footer />
      </div>
    </div>
  );
}
