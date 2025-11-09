import Navigation from "@/components/navigation";
import Deck from "@/components/deck";
import Background from "@/components/background";
import Socials from "@/components/socials";
import "./globals.css";

export const metadata = {
  title: "BLCKK",
  description: "The official BLCKK website",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
        <Deck />
        <Socials />
        <Background />
      </body>
    </html>
  );
}
