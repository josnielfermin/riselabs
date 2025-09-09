import { Socials } from "@/components/Socials";

export const Footer = () => {
  return (
    <footer className="w-full flex flex-col items-center justify-center self-end h-[60px] border-t border-foreground/10 px-8 py-4">
      <div className="text-center text-base font-normal text-white">
        All rights reserved <span className="font-bold">©Rise Labs</span>
      </div>
      <div className="lg:hidden">
        <Socials />
      </div>
    </footer>
  );
};
