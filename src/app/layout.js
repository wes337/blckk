import Logo from "@/components/logo";
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
        <Logo />
        {children}
        <Background />
      </body>
    </html>
  );
}
