import Navigation from "@/components/navigation";
import Deck from "@/components/deck";
import Footer from "@/components/footer";
import Background from "@/components/background";
import "./globals.css";

export const metadata = {
  title: "BLCKK",
  description: "The official BLCKK website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
        <Deck />
        <Footer />
        <Background />
      </body>
    </html>
  );
}
