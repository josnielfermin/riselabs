"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = ({ className, width = 84, height = 35.94 }: LogoProps) => {
  const router = useRouter();

  return (
    <>
      <Image
        src="/static/images/rise-labs-logo.png"
        quality={100}
        alt="Rise Labs"
        width={width}
        height={height}
        className={`${className} cursor-pointer max-md:hidden`}
        onClick={() => router.push("/")}
      />
      <Image
        src="/static/images/rise-labs-logo-mobile.png"
        quality={100}
        alt="Rise Labs"
        width={58}
        height={24}
        className={`${className} cursor-pointer md:hidden`}
        onClick={() => router.push("/")}
      />
    </>
  );
};
