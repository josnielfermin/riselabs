import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
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
        <div className="flex min-h-screen bg-gradient-to-b from-black via-[#0b0f0d] to-[#0d1f1c] text-white">
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            <Header />

            {/* Page content */}
            <div className="flex-1">{children}</div>
            <div className="lg:hidden">
              <Footer />
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
