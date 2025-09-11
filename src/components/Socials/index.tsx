import Image from "next/image";
import { Content } from "@/components/content";

export const Socials = () => {
  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-[clamp(1.125rem,_0.875rem_+_0.521vw,_1.5rem)] font-medium text-white relative pb-4 max-md:hidden">
        {Content.socials.title}
        <div className="absolute left-0 bottom-0 h-[2px] w-[100%] [background:linear-gradient(to_right,_#7B827C_0%,_rgba(123,130,124,0)_100%)]"></div>
      </h3>
      <div className="flex items-center gap-3">
        {Content.socials.links.map((link, index) => (
          <a
            key={link.name}
            className="flex flex-col items-center justify-center md:border md:border-primary-2 rounded-full w-[clamp(2.5rem,_1.917rem_+_1.215vw,_3.375rem)] h-[clamp(2.5rem,_1.917rem_+_1.215vw,_3.375rem)] md:[background:rgba(34,_38,_35,_0.20)] relative group overflow-hidden cursor-pointer"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={"/static/images/button-decorator.svg"}
              alt={""}
              width={40}
              height={40}
              className="absolute inset-0 m-auto object-cover md:hidden z-[1]"
            />
            <span
              className={`${link.icon} text-[clamp(0.875rem,_0.458rem_+_0.868vw,_1.5rem)] z-[1]`}
            ></span>
            <Image
              src={"/static/images/socials-gradient.svg"}
              alt=""
              fill
              className="absolute bottom-0 left-0 right-0 *:transition-all !duration-300 opacity-0 group-hover:opacity-100 z-[0]"
            />
          </a>
        ))}
      </div>
    </section>
  );
};
