import React from "react";
import { ProductPreview } from "@/components/ProductPreview";
import type { Product } from "@/library/types/product";

interface TooltipProps {
  product: Product | null;
  visible: boolean;
  left?: number | string;
  top?: number | string;
  onEnter?: () => void;
  onLeave?: () => void;
}

export const Tooltip = ({
  product,
  visible,
  left = "100%",
  top = 120,
  onEnter,
  onLeave,
}: TooltipProps) => {
  if (!product) return null;

  const leftStyle = typeof left === "number" ? `${left}px` : left;
  const topStyle = typeof top === "number" ? `${top}px` : top;

  return (
    <div
      className={`pointer-events-auto absolute z-[9999] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ left: leftStyle, top: topStyle }}
      aria-hidden={!visible}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="">
        <ProductPreview product={product} />
      </div>
    </div>
  );
};
