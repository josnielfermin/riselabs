import { Content } from "@/components/content";

export const Products = () => {
  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-2xl font-medium text-white">
        {Content.products.title}
      </h3>
      <p className="text-lg text-gray-400">{Content.products.description}</p>
      <div className="flex flex-col">
        {Content.products.items.map((item, index) => (
          <div key={item.title} className="flex items-center">
            <span className={`${item.icon}`}></span>
            <h4 className="mt-2 text-xl font-semibold text-white">
              {item.title}
            </h4>
          </div>
        ))}
      </div>
    </section>
  );
};
