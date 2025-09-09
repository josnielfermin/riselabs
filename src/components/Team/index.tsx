import Image from "next/image";
import { Content } from "@/components/content";

export const Team = () => {
  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-2xl font-medium text-white">{Content.team.title}</h3>
      <div className="flex">
        {Content.team.members.map((member, index) => (
          <div key={member.name} className="flex flex-col items-center">
            <Image
              src={member.image}
              alt={member.name}
              className="w-14 h-14 rounded-full"
              width={54}
              height={54}
            />
            <h4 className="mt-2 text-xl font-semibold text-white">
              {member.name}
            </h4>
            <p className="text-sm text-gray-400">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
