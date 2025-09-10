import { Product } from "@/library/types/product";
import Image from "next/image";

interface ProductPreviewProps {
  product: Product;
}

export const ProductPreview = ({ product }: ProductPreviewProps) => {
  return (
    <div className="relative w-[727px] h-[657px] p-10 flex flex-col justify-between gap-8">
      <Image
        src={"/static/images/preview-product-bg.png"}
        alt={""}
        // width={727}
        // height={657}
        fill
        className="absolute inset-0 object-cover z-[-1]"
      />
      <h2 className="uppercase text-[32px] font-normal pb-8 relative">
        {product.title}
        <div className="absolute left-0 bottom-0 h-[2px] w-[100%] [background:linear-gradient(to_right,_#7B827C_0%,_rgba(123,130,124,0)_100%)]"></div>
      </h2>
      <div className="flex items-baseline justify-between gap-4">
        <div className="text-white text-2xl font-normal w-full max-w-[200px]">
          {product.subtitle}
        </div>
        <div className="text-base-2 text-base font-normal max-w-[400x]">
          {product.description}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className={`${product.icon} text-base-3 text-6xl`}></div>
        <div className="grid grid-cols-2 gap-4">
          {product.images.map((image, index) => (
            <div
              key={index}
              className="relative h-32 overflow-hidden rounded-lg"
            >
              <Image src={image} alt={product.title} width={194} height={143} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
