import { Content } from "@/components/content";
export const Hero = () => {
  return (
    <section className="flex flex-col max-md:text-center max-md:items-center max-w-[377px] md:gap-12 gap-4 max-md:mt-8">
      <h1 className=" text-[clamp(2rem,_0.333rem_+_3.472vw,_4.5rem)] leading-[1.2] font-medium text-white max-w-[clamp(16.75rem,_12.208rem_+_9.462vw,_23.563rem)] max-md:leading-[44px]">
        {Content.hero.title}{" "}
        <span className="!font-light text-base-1">{Content.hero.subtitle}</span>
      </h1>
      <p className="text-[clamp(0.875rem,_0.458rem_+_0.868vw,_1.5rem)] font-normal text-white max-md:max-w-[273px]">
        {Content.hero.description}
      </p>
    </section>
  );
};
