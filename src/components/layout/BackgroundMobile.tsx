"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export const BackgroundMobile = () => {
  return (
    <div
      //   ref={containerRef}
      className="absolute -bottom-28 -right-64 md:hidden pointer-events-none select-none will-change-transform z-[-1] w-[1198.33px] h-[742.59px]"
      style={{ transform: "translate(0px, 0px)" }}
    >
      <Image
        src="/static/images/bg-decorator-mobile.png"
        alt=""
        width={1198.33}
        height={742.59}
        priority={true}
      />
    </div>
  );
};
