import { Hero } from "@/components/Hero";
import { Rise3D } from "@/components/Rise3D";
import { Team } from "@/components/Team";
import { Socials } from "@/components/Socials";
import { Products } from "@/components/Products";

export default function Home() {
  return (
    <div className="h-full flex flex-col max-lg:items-center justify-between">
      <div className="flex items-end max-lg:items-center max-lg:flex-col lg:justify-between justify-center lg:pr-[250px] max-lg:gap-6">
        <Hero />
        <Rise3D />
        <div className="lg:hidden">
          <Products />
        </div>
      </div>
      <div className="flex items-center max-lg:flex-col lg:justify-between justify-center">
        <Team />
        <div className="max-lg:hidden">
          <Socials />
        </div>
      </div>
    </div>
  );
}
