import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackupTab } from "@/components/studio/BackupTab";
import { CasesTab } from "@/components/studio/CasesTab";
import { ContentTab } from "@/components/studio/ContentTab";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Painel interno — Urb Concept" },
      { name: "description", content: "Área restrita de gestão de conteúdo da Urb Concept." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Painel interno — Urb Concept" },
      { property: "og:description", content: "Área restrita de gestão de conteúdo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Studio,
});

const ACCESS_CODE = "URB667";
const SESSION_KEY = "urb-studio-access";

const TABS = [
  { id: "conteudo", label: "Conteúdo do site" },
  { id: "cases", label: "Cases" },
  { id: "backup", label: "Exportar / Importar" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (code.trim().toUpperCase() === ACCESS_CODE) {
          sessionStorage.setItem(SESSION_KEY, "1");
          onUnlock();
        } else {
          toast.error("Código inválido.");
        }
      }}
      className="mx-auto w-full max-w-sm border border-border bg-surface p-8"
    >
      <p className="label-mono">Acesso restrito</p>
      <h1 className="mt-3 font-display text-xl font-semibold text-foreground">Painel Interno</h1>
      <Input
        type="password"
        autoComplete="off"
        placeholder="Código de acesso"
        className="mt-6 rounded-none"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button
        type="submit"
        className="mt-4 w-full rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
      >
        Entrar
      </Button>
    </form>
  );
}

function Panel() {
  const [tab, setTab] = useState<TabId>("conteudo");

  return (
    <div className="mx-auto max-w-[1100px] space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="label-mono">Urb Concept — Gestão de Conteúdo</p>
          <h1 className="mt-3 font-display text-2xl font-semibold text-foreground">
            Painel Interno
          </h1>
        </div>
        <Link to="/" className="label-mono hover:text-foreground">
          ← Ver site
        </Link>
      </header>

      <nav className="flex flex-wrap gap-px border border-border bg-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
              tab === t.id
                ? "bg-surface-elevated text-foreground"
                : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "conteudo" && <ContentTab />}
      {tab === "cases" && <CasesTab />}
      {tab === "backup" && <BackupTab />}

      <p className="border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
        O conteúdo editado fica salvo neste navegador e não altera a estrutura do site. Para levar
        as alterações para outra hospedagem ou dispositivo, use a aba Exportar / Importar.
      </p>
    </div>
  );
}

function Studio() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SESSION_KEY) === "1");
  }, []);

  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <div className={unlocked ? "" : "flex min-h-[70vh] items-center"}>
        <div className="w-full">{unlocked ? <Panel /> : <Gate onUnlock={() => setUnlocked(true)} />}</div>
      </div>
    </div>
  );
}
