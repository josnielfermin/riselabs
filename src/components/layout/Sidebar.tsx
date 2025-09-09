"use client";

import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/Logo";
import { Products } from "@/components/Products";

export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 p-6 border-r border-gray-800">
      {/* Top: Logo */}
      <div>
        <Logo />
      </div>

      {/* Middle: Products */}
      <div>
        <Products />
      </div>

      {/* Bottom: Footer */}
      <Footer />
    </aside>
  );
};
