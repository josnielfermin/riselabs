import { Product } from "@/library/types/product";
import Image from "next/image";

interface ProductPreviewProps {
  product: Product;
}

export const ProductPreview = ({ product }: ProductPreviewProps) => {
  return (
    <div className="relative md:w-[clamp(28.25rem,_16.792rem_+_23.872vw,_45.438rem)] md:h-[clamp(25.531rem,_15.177rem_+_21.571vw,_41.063rem)] w-full p-[clamp(1rem,_0rem_+_2.083vw,_2.5rem)] flex flex-col justify-between gap-[clamp(0.625rem,_-0.292rem_+_1.91vw,_2rem)]">
      <Image
        src={"/static/images/preview-product-bg.png"}
        alt={""}
        // width={727}
        // height={657}
        fill
        className="absolute inset-0 object-cover z-[-1] max-md:hidden"
      />
      <h2 className="uppercase text-[clamp(1.5rem,_1.167rem_+_0.694vw,_2rem)] font-normal pb-[clamp(1rem,_0.333rem_+_1.389vw,_2rem)] relative text-base-3">
        {product.title}
        <div className="absolute left-0 bottom-0 h-[2px] w-[100%] [background:linear-gradient(to_right,_#7B827C_0%,_rgba(123,130,124,0)_100%)]"></div>
      </h2>
      <div className="flex max-md:flex-col max-md:w-full md:items-baseline md:justify-between gap-4">
        <div className="text-white text-[clamp(1.125rem,_0.875rem_+_0.521vw,_1.5rem)] font-normal w-full md:max-w-[200px]">
          {product.subtitle}
        </div>
        <div className="text-base-2 text-[clamp(0.75rem,_0.583rem_+_0.347vw,_1rem)] font-normal md:max-w-[400x]">
          {product.description}
        </div>
      </div>
      <div className="flex items-end justify-between max-xs:flex-col-reverse max-xs:items-center gap-4 w-full">
        <div className="max-xs:w-full max-xs:flex max-xs:items-center max-xs:justify-between max-xs:gap-4">
          <div
            className={`${product.icon} text-base-3 text-[clamp(2rem,_0.833rem_+_2.431vw,_3.75rem)]`}
          ></div>
          <div className="xs:hidden text-base font-normal text-base-3">
            View Case Study <span className={`icon-arrow-right text-sm`}></span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {product.images.map((image, index) => (
            <div
              key={index}
              className="relative h-[clamp(5.625rem,_4.042rem_+_3.299vw,_8rem)] overflow-hidden rounded-lg"
            >
              <Image
                src={image}
                alt={product.title}
                width={194}
                height={143}
                className="w-[clamp(8.761rem,_6.518rem_+_4.673vw,_12.125rem)] h-[clamp(6.457rem,_4.804rem_+_3.444vw,_8.938rem)] max-xs:w-full max-xs:h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
