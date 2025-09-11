import Image from "next/image";

interface Rise3DProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Rise3D = ({
  className,
  width = 323,
  height = 323,
}: Rise3DProps) => {
  return (
    <Image
      src="/static/images/rise-3d.png"
      quality={100}
      alt="Rise Labs"
      width={width}
      height={height}
      className={`${className} cursor-pointer relative w-[clamp(8rem,_-0.125rem_+_16.927vw,_20.188rem)] h-[clamp(8rem,_-0.125rem_+_16.927vw,_20.188rem)] md:absolute 2xl:right-[20%] md:right-0 md:top-1/2 md:-translate-y-1/2 2xl:bottom-0 2xl:-translate-y-24 max-md:mx-auto`}
    />
  );
};
