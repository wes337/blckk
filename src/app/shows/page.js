import Card from "@/components/card";

export default function ShowsPage() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col gap-8 items-center justify-center z-10">
      <div className="text-2xl text-shadow-[2px_2px_0px_#16232590] uppercase">
        Shows
      </div>
      <div className="grid grid-cols-2 gap-4 text-darkest text-shadow-[1px_1px_0px_#16232590]">
        <Card>Card 1</Card>
        <Card>Card 2</Card>
        <Card>Card 3</Card>
        <Card>Card 4</Card>
      </div>
    </div>
  );
}
