"use client";
import useMediaQuery from "@/library/hooks/useMediaQuery";
import { Logo } from "../Logo";
import { Button } from "@/components/ui/Button";

export const Header = () => {
  const webUrl = "https://t.me/Satsyxbt";
  const isMobile = useMediaQuery("(max-width: 1024px)");

  return (
    <header className="w-full flex items-center justify-between lg:justify-end gap-4 px-8 py-4 h-[116px]">
      <div className="lg:hidden">
        <Logo />
      </div>
      <a href={webUrl} target="_blank" rel="noopener noreferrer">
        <Button
          label={!isMobile && "Talk on Telegram"}
          radius="full"
          variant="filled"
          rightIcon={"icon-telegram-2"}
        />
      </a>
    </header>
  );
};
