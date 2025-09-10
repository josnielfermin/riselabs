import Image from "next/image";
import { Content } from "@/components/content";

export const Team = () => {
  return (
    <section className="flex flex-col max-lg:items-center gap-6">
      <h3 className="text-2xl max-lg:text-lg max-lg:text-center font-medium text-white pb-4 relative">
        {Content.team.title}
        <div className="absolute left-0 bottom-0 h-[2px] w-[100%] [background:linear-gradient(to_right,_#7B827C_0%,_rgba(123,130,124,0)_100%)]"></div>
      </h3>
      <div className="flex">
        {Content.team.members.map((member, index) => (
          <div
            key={member.name}
            className={`flex flex-col items-center group relative ${
              Number(index) > 0 && "-ml-4"
            }`}
          >
            <Image
              src={member.image}
              alt={member.name}
              className="w-14 h-14 rounded-full group-hover:border group-hover:border-primary-2 *:transition-all !duration-300 group-hover:-translate-y-7 group-hover:z-[1]"
              width={54}
              height={54}
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 border border-primary-2 rounded-full text-white font-normal text-xs px-2.5 py-1 opacity-0 group-hover:opacity-100 *:transition-all !duration-300 whitespace-nowrap z-[1]">
              {member.name} - {member.role}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
