import type { Metadata } from "next";
import { Montserrat, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import ChatWidget from "@/components/ChatWidget";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Wikimedia Indonesia",
  description: "Portal informasi Wikimedia Indonesia",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/Logo_WMID.png", type: "image/png" },
    ],
    apple: [
      { url: "/Logo_WMID.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${montserrat.variable} ${sourceSerif.variable} antialiased`}
        suppressHydrationWarning
      >
        <Analytics />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}