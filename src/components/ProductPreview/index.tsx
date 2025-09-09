import { Product } from "@/library/types/product";
import Image from "next/image";

interface ProductPreviewProps {
  product: Product;
}

export const ProductPreview = ({ product }: ProductPreviewProps) => {
  return (
    <div>
      <h2>{product.title}</h2>
      <div className="flex items-baseline justify-between">
        <span className="text-gray-400">{product.subtitle}</span>
        <span className="text-palm-green-400">{product.description}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className={`${product.icon}`}></div>
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
