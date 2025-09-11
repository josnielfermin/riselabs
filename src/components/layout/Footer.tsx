import { Socials } from "@/components/Socials";

export const Footer = () => {
  return (
    <footer className="w-full flex flex-col gap-2.5 items-center justify-center self-end md:mb-[84px] pb-6 pt-3 max-md:bg-base-6 z-[1]">
      <div className="text-center text-[clamp(0.75rem,_0.583rem_+_0.347vw,_1rem)] font-normal text-white">
        All rights reserved <span className="font-bold">©Rise Labs</span>
      </div>
      <div className="md:hidden">
        <Socials />
      </div>
    </footer>
  );
};
