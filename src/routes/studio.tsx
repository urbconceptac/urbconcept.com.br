import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fileToDataUrl, useCases, type CaseItem } from "@/lib/cases";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Painel interno — Urb Concept" },
      { name: "description", content: "Área restrita de gestão de portfólio da Urb Concept." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Painel interno — Urb Concept" },
      { property: "og:description", content: "Área restrita de gestão de portfólio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Studio,
});

const ACCESS_CODE = "URB667";
const SESSION_KEY = "urb-studio-access";

const emptyDraft = {
  client: "",
  scope: "",
  year: "",
  summary: "",
  challenge: "",
  solution: "",
};

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
  const { cases, custom, addCase, removeCase } = useCases();
  const [draft, setDraft] = useState(emptyDraft);
  const [logo, setLogo] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function ingest(files: FileList | null) {
    if (!files?.length) return;
    const images = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!images.length) {
      toast.error("Envie apenas arquivos de imagem.");
      return;
    }
    const urls = await Promise.all(images.map(fileToDataUrl));
    setLogo((prev) => prev || urls[0] || "");
    setGallery((prev) => [...prev, ...urls]);
  }

  function submit() {
    if (!draft.client.trim() || !logo) {
      toast.error("Informe o cliente e envie ao menos a logomarca.");
      return;
    }
    const item: Omit<CaseItem, "id" | "custom"> = {
      client: draft.client.trim(),
      scope: draft.scope.trim() || "Projeto",
      ...(draft.year.trim() ? { year: draft.year.trim() } : {}),
      logo,
      logoIsWhite: false,
      summary: draft.summary.trim(),
      challenge: draft.challenge.trim(),
      solution: draft.solution.trim(),
      gallery: gallery.length ? gallery : [logo],
    };
    addCase(item);
    setDraft(emptyDraft);
    setLogo("");
    setGallery([]);
    toast.success("Case publicado no portfólio.");
  }

  return (
    <div className="mx-auto max-w-[1000px] space-y-12">
      <header className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="label-mono">Urb Concept — Gestão de Portfólio</p>
          <h1 className="mt-3 font-display text-2xl font-semibold text-foreground">
            Painel Interno
          </h1>
        </div>
        <Link to="/" className="label-mono hover:text-foreground">
          ← Ver site
        </Link>
      </header>

      <section className="border border-border bg-surface p-6 md:p-8">
        <p className="label-mono">Novo case</p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void ingest(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed p-10 text-center transition-colors ${
            dragging ? "border-foreground bg-surface-elevated" : "border-border bg-background/40"
          }`}
        >
          <span className="font-mono text-2xl text-subtle">+</span>
          <p className="label-mono">Arraste as imagens</p>
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            A primeira imagem vira a logomarca do card (clique em outra abaixo para trocar). As
            demais entram como lâminas do projeto.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => void ingest(e.target.files)}
          />
        </div>

        {gallery.length > 0 && (
          <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {gallery.map((src, i) => (
              <button
                key={src.slice(-24) + i}
                type="button"
                onClick={() => setLogo(src)}
                className={`relative aspect-square overflow-hidden border ${
                  logo === src ? "border-foreground" : "border-border"
                }`}
              >
                <img src={src} alt={`Imagem ${i + 1}`} className="h-full w-full object-cover" />
                {logo === src && (
                  <span className="label-mono absolute bottom-1 left-1 bg-background/80 px-1">
                    logo
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Input
            placeholder="Cliente"
            className="rounded-none"
            value={draft.client}
            onChange={(e) => setDraft({ ...draft, client: e.target.value })}
          />
          <Input
            placeholder="Escopo"
            className="rounded-none"
            value={draft.scope}
            onChange={(e) => setDraft({ ...draft, scope: e.target.value })}
          />
          <Input
            placeholder="Ano"
            className="rounded-none"
            value={draft.year}
            onChange={(e) => setDraft({ ...draft, year: e.target.value })}
          />
        </div>
        <div className="mt-4 grid gap-4">
          <Textarea
            placeholder="Resumo do projeto"
            className="rounded-none"
            value={draft.summary}
            onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
          />
          <Textarea
            placeholder="Desafio"
            className="rounded-none"
            value={draft.challenge}
            onChange={(e) => setDraft({ ...draft, challenge: e.target.value })}
          />
          <Textarea
            placeholder="Solução"
            className="rounded-none"
            value={draft.solution}
            onChange={(e) => setDraft({ ...draft, solution: e.target.value })}
          />
        </div>

        <Button
          onClick={submit}
          className="mt-6 rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
        >
          Publicar case
        </Button>
      </section>

      <section>
        <p className="label-mono">Portfólio atual — {cases.length} cases</p>
        <ul className="mt-4 divide-y divide-border border border-border">
          {cases.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-4 bg-surface px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{c.client}</p>
                <p className="label-mono mt-1">
                  {c.scope} {c.custom ? "— adicionado por você" : "— fixo"}
                </p>
              </div>
              {c.custom && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none font-mono text-[10px] uppercase tracking-[0.16em]"
                  onClick={() => removeCase(c.id)}
                >
                  Remover
                </Button>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Os {custom.length} cases adicionados por aqui ficam salvos neste navegador.
        </p>
      </section>
    </div>
  );
}

function Studio() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SESSION_KEY) === "1");
  }, []);

  return (
    <div className="flex min-h-screen items-center bg-background px-6 py-16">
      <div className="w-full">
        {unlocked ? <Panel /> : <Gate onUnlock={() => setUnlocked(true)} />}
      </div>
    </div>
  );
}
