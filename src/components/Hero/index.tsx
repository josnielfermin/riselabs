import { Content } from "@/components/content";
export const Hero = () => {
  return (
    <section className="flex flex-col max-lg:text-center max-lg:items-center max-w-[377px] lg:gap-12 gap-4 max-lg:mt-8">
      <h1 className="text-7xl max-lg:text-[32px] font-medium text-white max-w-[377px] max-lg:leading-[44px] max-lg:max-w-[268px]">
        {Content.hero.title}{" "}
        <span className="!font-light text-base-1">{Content.hero.subtitle}</span>
      </h1>
      <p className="text-2xl max-lg:text-sm font-normal text-white max-lg:max-w-[273px]">
        {Content.hero.description}
      </p>
    </section>
  );
};
