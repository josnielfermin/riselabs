import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import { Background } from "@/components/layout/BackgroundNew";
import { BackgroundMobile } from "@/components/layout/BackgroundMobile";
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
      <body className={`${hostGrotesk.className} antialiased`}>
        <div className="flex min-h-screen text-white overflow-hidden relative z-0 max-w-[1920px] mx-auto">
          <Background />
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden relative z-10">
            <BackgroundMobile />
            <Header />
            <div className="flex-1 mx-[clamp(1.875rem,_-0.208rem_+_4.34vw,_5rem)] mb-[clamp(3.125rem,_1.042rem_+_4.34vw,_6.25rem)]">
              {children}
            </div>
            <div className="md:hidden">
              <Footer />
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
