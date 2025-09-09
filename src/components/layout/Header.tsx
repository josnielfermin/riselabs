import { Content } from "@/components/content";
import { Button } from "@/components/ui/Button";

export const Header = () => {
  return (
    <header className="w-full flex items-center justify-end border-b gap-4 border-foreground/10 px-8 py-4 h-[60px]">
      <nav className="flex items-center gap-4">
        {Content.header.map((item) => (
          <a
            key={item.title}
            href={item.url}
            className="text-sm text-foreground/70 hover:text-foreground"
          >
            {item.title}
          </a>
        ))}
      </nav>
      <Button label="Talk on Telegram" rightIcon={"icon-telegram-2"} />
    </header>
  );
};
