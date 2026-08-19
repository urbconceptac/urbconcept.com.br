import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { media } from "@/lib/media";


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
            src={media.logo}
            alt="Urb Concept"
            width={80}
            height={80}
            className={`object-contain transition-all duration-300 ${
              scrolled ? "h-9 w-9" : "h-[72px] w-[72px]"
            }`}
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

        <Button asChild variant="outline" size="sm" className="rounded-none">
          <a href="#iniciar-projeto" className="font-mono text-[11px] tracking-[0.16em] uppercase">
            Iniciar Projeto
          </a>
        </Button>
      </div>
    </header>
  );
}
