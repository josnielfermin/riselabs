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
      className={`${className} cursor-pointer relative lg:top-7 max-lg:w-32 max-lg:h-32 max-lg:mx-auto`}
    />
  );
};
