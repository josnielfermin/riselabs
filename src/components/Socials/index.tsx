import Image from "next/image";
import { Content } from "@/components/content";

export const Socials = () => {
  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-2xl font-medium text-white">
        {Content.socials.title}
      </h3>
      <div className="flex">
        {Content.socials.links.map((link, index) => (
          <div key={link.name} className="flex flex-col items-center">
            <span className={`${link.icon}`}></span>
          </div>
        ))}
      </div>
    </section>
  );
};
