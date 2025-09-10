"use client";

import Image from "next/image";
import { Content } from "@/components/content";
import React from "react";

interface ProductsProps {
  onHover?: (product: any, e: React.MouseEvent<HTMLDivElement>) => void;
  onLeave?: () => void;
}

export const Products = ({ onHover, onLeave }: ProductsProps) => {
  return (
    <section className="flex flex-col justify-between lg:h-[441px] relative lg:-top-10">
      <div className="flex flex-col max-lg:items-center gap-2">
        <h3 className="text-2xl max-lg:text-lg max-lg:text-center font-medium text-white relative pb-4">
          {Content.products.title}
          <div className="absolute left-0 bottom-0 h-[2px] w-[90%] [background:linear-gradient(to_right,_#7B827C_0%,_rgba(123,130,124,0)_100%)]"></div>
        </h3>
        <p className="text-lg max-lg:text-sm max-lg:text-center font-normal text-base-2">
          {Content.products.description}
        </p>
      </div>
      <div className="flex lg:flex-col justify-center gap-6">
        {Content.products.items.map((item, index) => (
          <div
            key={item.title}
            className={`flex items-center justify-between text-base-3 gap-6 px-3 py-4 relative group`}
            onMouseEnter={(e) => onHover?.(item, e)}
            onMouseLeave={() => onLeave?.()}
          >
            <div className="flex items-center gap-6">
              <span className={`${item.icon} ${item.iconSize}`}></span>
              <h4
                className={`text-lg font-normal max-lg:hidden ${
                  item.title === "Hype Engine" ? "ml-1.5" : ""
                }`}
              >
                {item.title}
              </h4>
            </div>
            <div className="absolute left-0 bottom-0 h-[2px] w-[100%] [background:linear-gradient(to_right,_#7B827C_0%,_rgba(123,130,124,0)_100%)] max-lg:hidden"></div>
            <span
              className={`icon-arrow-right max-lg:hidden text-2xl group-hover:opacity-100 opacity-0 *:transition-all !duration-300`}
            ></span>
            <Image
              src={"/static/images/product-gradient.png"}
              alt={""}
              fill
              className="w-full h-full max-lg:hidden absolute z-[-1] group-hover:opacity-100 opacity-0 *:transition-all !duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
};
