import { Content } from "@/components/content";
export const Hero = () => {
  return (
    <section className="flex flex-col max-w-[377px] gap-12">
      <h1 className="text-7xl font-medium text-white max-w-[377px]">
        {Content.hero.title}{" "}
        <span className="!font-light text-base-1">{Content.hero.subtitle}</span>
      </h1>
      <p className="text-2xl font-normal text-white">
        {Content.hero.description}
      </p>
    </section>
  );
};
