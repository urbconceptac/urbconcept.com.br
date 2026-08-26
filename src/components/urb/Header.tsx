import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { media } from "@/lib/media";
import { whatsappLink } from "@/lib/whatsapp";


const links = [
  { id: "manifesto", index: "01", label: "Manifesto" },
  { id: "capacidades", index: "02", label: "Capacidades" },
  { id: "proof-of-concept", index: "03", label: "Proof of Concept" },
  { id: "processo", index: "04", label: "Processo" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${
        scrolled ? "border-border bg-background/90 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <a href="#top" className="flex items-center">
         <img 
  src="/logo-urb.png" 
  alt="Urb Concept" 
  width="80" 
  height="80" 
  className="object-contain transition-all duration-300 h-[72px] w-[72px]" 
/>
        </a>



        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="text-subtle">{l.index}.</span> {l.label}
            </a>
          ))}
        </nav>

        <Button
          asChild
          size="sm"
          className="rounded-none bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
        >
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase"
          >
            <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span className="hidden sm:inline">Falar no WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </Button>
      </div>
    </header>
  );
}
