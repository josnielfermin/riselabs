"use client";
import { Content } from "@/components/content";
import { Button } from "@/components/ui/Button";

export const Header = () => {
  const webUrl = "https://t.me/Satsyxbt";

  return (
    <header className="w-full flex items-center justify-end gap-4 px-8 py-4 h-[116px]">
      <a href={webUrl} target="_blank" rel="noopener noreferrer">
        <Button label="Talk on Telegram" rightIcon={"icon-telegram-2"} />
      </a>
    </header>
  );
};
