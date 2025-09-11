"use client";

import Image from "next/image";
import { Content } from "@/components/content";
import React from "react";

interface ProductsProps {
  onHover?: (product: any, e: React.MouseEvent<HTMLDivElement>) => void;
  onLeave?: () => void;
  onClick?: (product: any) => void;
}

export const Products = ({ onHover, onLeave, onClick }: ProductsProps) => {
  return (
    <section className="flex flex-col justify-between md:h-[441px] relative md:-top-10">
      <div className="flex flex-col max-md:items-center gap-2">
        <h3 className="text-[clamp(1.125rem,_0.875rem_+_0.521vw,_1.5rem)] max-md:text-center font-medium text-white relative pb-4">
          {Content.products.title}
          <div className="absolute left-0 bottom-0 h-[2px] w-[90%] [background:linear-gradient(to_right,_#7B827C_0%,_rgba(123,130,124,0)_100%)]"></div>
        </h3>
        <p className="text-[clamp(0.875rem,_0.708rem_+_0.347vw,_1.125rem)] max-md:text-center font-normal text-base-2 max-md:max-w-[256px]">
          {Content.products.description}
        </p>
      </div>
      <div className="flex md:flex-col justify-center gap-6">
        {Content.products.items.map((item, index) => (
          <div
            key={item.title}
            className={`flex items-center justify-between text-base-3 gap-6 px-3 py-4 relative group`}
            onMouseEnter={(e) => onHover?.(item, e)}
            onMouseLeave={() => onLeave?.()}
            onClick={() => onClick?.(item)}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
              if (onClick && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onClick(item);
              }
            }}
          >
            <Image
              src={"/static/images/button-decorator.svg"}
              alt={""}
              width={70}
              height={70}
              className="absolute inset-0 m-auto md:hidden object-cover"
            />
            <div className="flex items-center gap-6">
              <span className={`${item.icon} ${item.iconSize}`}></span>
              <h4
                className={`text-[clamp(0.875rem,_0.708rem_+_0.347vw,_1.125rem)] font-normal max-md:hidden ${
                  item.title === "Hype Engine" ? "ml-1.5" : ""
                }`}
              >
                {item.title}
              </h4>
            </div>
            <div className="absolute left-0 bottom-0 h-[2px] w-[100%] [background:linear-gradient(to_right,_#7B827C_0%,_rgba(123,130,124,0)_100%)] max-md:hidden"></div>
            <span
              className={`icon-arrow-right max-md:hidden text-[clamp(1.125rem,_0.875rem_+_0.521vw,_1.5rem)] group-hover:opacity-100 opacity-0 *:transition-all !duration-300`}
            ></span>
            <Image
              src={"/static/images/product-gradient.png"}
              alt={""}
              fill
              className="w-full h-full max-md:hidden absolute z-[-1] group-hover:opacity-100 opacity-0 *:transition-all !duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
};
