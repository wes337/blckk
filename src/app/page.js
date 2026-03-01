import Footer from "@/components/footer";
import Countdown from "@/components/countdown";

export default function HomePage() {
  return (
    <>
      <div className="fixed bottom-[40%] md:bottom-[33%] left-[50%] translate-x-[-50%] z-10">
        <Countdown />
      </div>
      <div className="fixed bottom-0 w-full">
        <Footer />
      </div>
    </>
  );
}
