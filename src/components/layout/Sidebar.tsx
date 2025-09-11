"use client";

import React, { useRef, useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/Logo";
import { Products } from "@/components/Products";
import { Tooltip } from "@/components/Products/Tooltip";
import type { Product } from "@/library/types/product";

export const Sidebar = () => {
  const [hoverProduct, setHoverProduct] = useState<Product | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const hideTimerRef = useRef<number | null>(null);

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const handleHover = (
    product: Product,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    clearHideTimer();
    setHoverProduct(product);
    setTooltipVisible(true);
    setPos({ x: e.clientX, y: e.clientY });
  };

  const handleLeave = () => {
    // delay hiding so mouse can move to the tooltip without it disappearing
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setTooltipVisible(false);
      setHoverProduct(null);
      hideTimerRef.current = null;
    }, 200);
  };

  return (
    <aside className="hidden md:flex flex-col justify-between w-[clamp(19.75rem,_14.708rem_+_10.503vw,_27.313rem)] md:[&>*]:w-[263px] items-center relative">
      <div className="absolute right-0 top-0 !w-[2px] h-[90vh] [background:linear-gradient(to_bottom,_#7B827C_0%,_rgba(123,130,124,0)_100%)]"></div>
      <div className="h-[116px] flex items-center">
        <Logo />
      </div>

      <div>
        <Products onHover={handleHover} onLeave={handleLeave} />
      </div>

      <div>
        <Footer />
      </div>

      <Tooltip
        product={hoverProduct}
        visible={tooltipVisible}
        left={"100%"}
        top={120}
        onEnter={() => {
          clearHideTimer();
          setTooltipVisible(true);
        }}
        onLeave={handleLeave}
      />
    </aside>
  );
};
