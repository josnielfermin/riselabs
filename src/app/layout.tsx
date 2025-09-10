import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import { Background } from "@/components/layout/Background";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";

const hostGrotesk = Host_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rise Labs",
  description: "Driving Innovation in DeFi and Web3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${hostGrotesk.className} antialiased lg:overflow-hidden`}
      >
        <Background />
        <div className="flex min-h-screen text-white">
          <Sidebar />
          <main className="flex-1 flex flex-col">
            <Header />
            <div className="flex-1 mx-[80px] mb-[100px]">{children}</div>
            <div className="lg:hidden">
              <Footer />
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
