import Image from "next/image";
import { Content } from "@/components/content";

export const Socials = () => {
  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-2xl font-medium text-white relative pb-4">
        {Content.socials.title}
        <div className="absolute left-0 bottom-0 h-[2px] w-[100%] [background:linear-gradient(to_right,_#7B827C_0%,_rgba(123,130,124,0)_100%)]"></div>
      </h3>
      <div className="flex items-center gap-3">
        {Content.socials.links.map((link, index) => (
          <div
            key={link.name}
            className="flex flex-col items-center justify-center border border-primary-2 rounded-full w-[54px] h-[54px] [background:rgba(34,_38,_35,_0.20)]"
          >
            <span className={`${link.icon} text-2xl`}></span>
          </div>
        ))}
      </div>
    </section>
  );
};
