"use client";

import { Hero } from "@/components/Hero";
import { Rise3D } from "@/components/Rise3D";
import InteractiveRise from "@/components/Rise3D/InteractiveRise";
import { Team } from "@/components/Team";
import { Socials } from "@/components/Socials";
import { Products } from "@/components/Products";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ProductPreview } from "@/components/ProductPreview";
import type { Product } from "@/library/types/product";

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  return (
    <div className="h-full flex flex-col max-md:items-center justify-between">
      <div className="flex items-end max-md:items-center max-md:flex-col md:justify-between justify-center md:pr-[250px] max-md:gap-6 relative">
        <Hero />
        {/* <Rise3D /> */}
        <InteractiveRise />
        <div className="md:hidden">
          <Products onClick={handleProductClick} />
        </div>
      </div>
      <div className="flex items-center max-md:flex-col md:justify-between justify-center">
        <Team />
        <div className="max-md:hidden">
          <Socials />
        </div>
      </div>

      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        {selectedProduct ? <ProductPreview product={selectedProduct} /> : null}
      </Modal>
    </div>
  );
}
