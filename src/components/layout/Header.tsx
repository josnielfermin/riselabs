"use client";
import useMediaQuery from "@/library/hooks/useMediaQuery";
import { Logo } from "../Logo";
import { Button } from "@/components/ui/Button";

export const Header = () => {
  const webUrl = "https://t.me/Satsyxbt";
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <header className="w-full flex items-center justify-between md:justify-end gap-4 px-[clamp(1.875rem,_-0.208rem_+_4.34vw,_5rem)] py-4 h-[116px] max-md:h-[103px] max-md:border-b max-md:border-base-5">
      <div className="md:hidden max-md:mt-6">
        <Logo />
      </div>
      {/* <span className="icon-telegram-2 -ml-1"></span> */}
      <a
        href={webUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="max-md:mt-6"
        aria-label="Talk on Telegram"
      >
        <Button
          label={!isMobile && "TALK ON TELEGRAM"}
          ariaLabel="Talk on Telegram"
          radius="full"
          variant="filled"
          size={isMobile ? "md" : "lg"}
          rightIcon={
            isMobile ? (
              <span className="icon-telegram-2 !-ml-1.5"></span>
            ) : (
              "icon-telegram-2"
            )
          }
        />
      </a>
    </header>
  );
};
