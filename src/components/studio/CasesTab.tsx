import { useRef, useState } from "react";
import { AudioLines } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultCases,
  fileToDataUrl,
  useCases,
  type AudioTrack,
  type CaseItem,
} from "@/lib/cases";
import { IssueList, SectionCard, type Issue } from "./fields";

type CaseDraft = {
  client: string;
  scope: string;
  year: string;
  summary: string;
  challenge: string;
  solution: string;
  logoIsWhite: boolean;
  useWaveIcon: boolean;
};

const emptyCaseDraft: CaseDraft = {
  client: "",
  scope: "",
  year: "",
  summary: "",
  challenge: "",
  solution: "",
  logoIsWhite: false,
  useWaveIcon: false,
};

function validateCase(d: CaseDraft, logo: string): Issue[] {
  const issues: Issue[] = [];
  if (!d.client.trim()) issues.push({ level: "erro", message: "Informe o nome do cliente." });
  if (!d.useWaveIcon && !logo)
    issues.push({ level: "erro", message: "Envie a logomarca ou ative o ícone de ondas de áudio." });
  if (!d.summary.trim())
    issues.push({ level: "aviso", message: "Resumo vazio — o case abre sem texto de introdução." });
  if (!d.challenge.trim()) issues.push({ level: "aviso", message: "Campo 'Desafio' vazio." });
  if (!d.solution.trim()) issues.push({ level: "aviso", message: "Campo 'Solução' vazio." });
  return issues;
}

function CardPreview({
  draft,
  logo,
  galleryCount,
  audioCount,
}: {
  draft: CaseDraft;
  logo: string;
  galleryCount: number;
  audioCount: number;
}) {
  return (
    <div className="border border-border bg-surface p-6">
      <div className="flex items-start justify-between">
        <span className="label-mono">{draft.year || "—"}</span>
        <span className="label-mono">Prévia do card</span>
      </div>
      <div className="mt-4 flex h-32 items-center justify-center bg-background">
        {draft.useWaveIcon || !logo ? (
          <AudioLines className="h-12 w-12 text-foreground opacity-80" strokeWidth={1.25} />
        ) : (
          <img
            src={logo}
            alt="Prévia da logomarca"
            className={`max-h-20 max-w-full object-contain ${
              draft.logoIsWhite ? "" : "opacity-70 grayscale brightness-[1.8] contrast-125"
            }`}
          />
        )}
      </div>
      <div className="mt-4 border-t border-border pt-4">
        <p className="font-display text-sm font-semibold text-foreground">
          {draft.client || "Nome do cliente"}
        </p>
        <p className="label-mono mt-1">{draft.scope || "Escopo"}</p>
        <p className="label-mono mt-2">
          {galleryCount} lâminas · {audioCount} áudios
        </p>
      </div>
    </div>
  );
}

export function CasesTab() {
  const { cases, hidden, overridden, addCase, removeCase, restoreCase, updateCase } = useCases();
  const [draft, setDraft] = useState<CaseDraft>(emptyCaseDraft);
  const [logo, setLogo] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [audio, setAudio] = useState<AudioTrack[]>([]);
  const [audioLabel, setAudioLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);

  const hiddenCases = defaultCases.filter((c) => hidden.includes(c.id));
  const modifiedCases = defaultCases.filter(
    (c) => overridden.includes(c.id) && !hidden.includes(c.id),
  );

  function startEdit(c: CaseItem) {
    setEditingId(c.id);
    setDraft({
      client: c.client,
      scope: c.scope,
      year: c.year ?? "",
      summary: c.summary,
      challenge: c.challenge,
      solution: c.solution,
      logoIsWhite: c.logoIsWhite,
      useWaveIcon: c.icon === "wave",
    });
    setLogo(c.logo ?? "");
    setGallery(c.gallery);
    setAudio(c.audio ?? []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setDraft(emptyCaseDraft);
    setLogo("");
    setGallery([]);
    setAudio([]);
    setAudioLabel("");
    setEditingId(null);
  }

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

  async function ingestAudio(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    if (!f.type.startsWith("audio/")) {
      toast.error("Envie um arquivo de áudio.");
      return;
    }
    const src = await fileToDataUrl(f);
    const label = audioLabel.trim() || f.name.replace(/\.[^.]+$/, "");
    setAudio((prev) => [...prev, { label, src }]);
    setAudioLabel("");
  }

  const issues = validateCase(draft, logo);
  const errors = issues.filter((i) => i.level === "erro");

  function buildItem(): Omit<CaseItem, "id" | "custom"> {
    const item: Omit<CaseItem, "id" | "custom"> = {
      client: draft.client.trim(),
      scope: draft.scope.trim() || "Projeto",
      logoIsWhite: draft.logoIsWhite,
      summary: draft.summary.trim(),
      challenge: draft.challenge.trim() || "—",
      solution: draft.solution.trim() || "—",
      gallery: gallery.length ? gallery : logo ? [logo] : [],
    };

    const year = draft.year.trim();
    if (year) item.year = year;
    if (draft.useWaveIcon) item.icon = "wave";
    if (!draft.useWaveIcon && logo) item.logo = logo;
    if (audio.length) item.audio = audio;

    return item;
  }

  function confirmSave() {
    const item = buildItem();
    if (editingId) {
      updateCase(editingId, item);
      toast.success("Case atualizado no portfólio.");
    } else {
      addCase(item);
      toast.success("Case publicado no portfólio.");
    }
    resetForm();
    setReviewing(false);
  }

  return (
    <div className="space-y-10">
      <SectionCard title={editingId ? `Editando case — ${draft.client || "..."}` : "Novo case"}>
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
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed p-10 text-center transition-colors ${
            dragging ? "border-foreground bg-surface-elevated" : "border-border bg-background/40"
          }`}
        >
          <span className="font-mono text-2xl text-subtle">+</span>
          <p className="label-mono">Arraste as imagens</p>
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            A primeira imagem vira a logomarca do card (clique em outra abaixo para trocar). As
            demais entram como lâminas do projeto, exibidas coloridas no portfólio.
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
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {gallery.map((src, i) => (
              <div
                key={src.slice(-24) + i}
                className={`relative aspect-square overflow-hidden border ${
                  !draft.useWaveIcon && logo === src ? "border-foreground" : "border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setLogo(src)}
                  className="h-full w-full"
                  title="Usar como logomarca"
                >
                  <img src={src} alt={`Imagem ${i + 1}`} className="h-full w-full object-cover" />
                </button>
                {!draft.useWaveIcon && logo === src && (
                  <span className="label-mono absolute bottom-1 left-1 bg-background/80 px-1">
                    logo
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setGallery((prev) => prev.filter((g) => g !== src));
                    if (logo === src) setLogo("");
                  }}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-background/80 font-mono text-[10px] text-foreground"
                  title="Remover imagem"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={draft.useWaveIcon}
              onChange={(e) => setDraft({ ...draft, useWaveIcon: e.target.checked })}
              className="h-4 w-4 accent-foreground"
            />
            Sem logomarca — usar ícone de ondas de áudio
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={draft.logoIsWhite}
              onChange={(e) => setDraft({ ...draft, logoIsWhite: e.target.checked })}
              className="h-4 w-4 accent-foreground"
            />
            Logomarca já é branca/monocromática
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
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
        <div className="grid gap-4">
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

        <div className="border border-border p-5">
          <p className="label-mono">Faixas de áudio (spots, episódios)</p>
          {audio.length > 0 && (
            <ul className="mt-4 space-y-px border border-border bg-border">
              {audio.map((t, i) => (
                <li
                  key={t.src.slice(-24) + i}
                  className="flex items-center justify-between gap-3 bg-surface-elevated px-4 py-3"
                >
                  <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
                    <AudioLines className="h-4 w-4" strokeWidth={1.5} />
                    {t.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAudio((prev) => prev.filter((_, idx) => idx !== i))}
                    className="label-mono hover:text-foreground"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Input
              placeholder="Nome da faixa (ex.: Spot — Julho)"
              className="rounded-none sm:max-w-xs"
              value={audioLabel}
              onChange={(e) => setAudioLabel(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              className="rounded-none font-mono text-[10px] uppercase tracking-[0.16em]"
              onClick={() => audioRef.current?.click()}
            >
              Anexar áudio
            </Button>
            <input
              ref={audioRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                void ingestAudio(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setReviewing(true)}
            className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
          >
            {editingId ? "Revisar e salvar alterações" : "Revisar e publicar"}
          </Button>
          {editingId && (
            <Button
              variant="outline"
              onClick={resetForm}
              className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
            >
              Cancelar edição
            </Button>
          )}
        </div>
      </SectionCard>

      <section>
        <p className="label-mono">Portfólio no ar — {cases.length} cases</p>
        <ul className="mt-4 divide-y divide-border border border-border">
          {cases.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-4 bg-surface px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{c.client}</p>
                <p className="label-mono mt-1">
                  {c.scope}
                  {c.custom ? " — adicionado por você" : " — fixo"}
                  {overridden.includes(c.id) ? " — modificado" : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none font-mono text-[10px] uppercase tracking-[0.16em]"
                  onClick={() => startEdit(c)}
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none font-mono text-[10px] uppercase tracking-[0.16em]"
                  onClick={() => {
                    removeCase(c.id);
                    toast.success(
                      c.custom ? "Case removido." : "Case oculto — restaure quando quiser.",
                    );
                  }}
                >
                  {c.custom ? "Remover" : "Ocultar"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {(hiddenCases.length > 0 || modifiedCases.length > 0) && (
        <section>
          <p className="label-mono">Arquivo — ocultos e modificados</p>
          <ul className="mt-4 divide-y divide-border border border-border">
            {hiddenCases.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-4 bg-surface px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.client}</p>
                  <p className="label-mono mt-1">oculto do site</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none font-mono text-[10px] uppercase tracking-[0.16em]"
                  onClick={() => {
                    restoreCase(c.id);
                    toast.success("Case restaurado ao portfólio.");
                  }}
                >
                  Restaurar
                </Button>
              </li>
            ))}
            {modifiedCases.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-4 bg-surface px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.client}</p>
                  <p className="label-mono mt-1">visível com alterações suas</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none font-mono text-[10px] uppercase tracking-[0.16em]"
                  onClick={() => {
                    restoreCase(c.id);
                    toast.success("Case restaurado ao conteúdo original.");
                  }}
                >
                  Restaurar original
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Dialog open={reviewing} onOpenChange={setReviewing}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-none border-border bg-surface p-0">
          <div className="border-b border-border p-6">
            <span className="label-mono">Validação e prévia</span>
            <DialogTitle className="mt-2 font-display text-xl font-semibold text-foreground">
              {editingId ? "Revisão das alterações" : "Revisão antes de publicar"}
            </DialogTitle>
          </div>

          <div className="space-y-6 p-6">
            <IssueList issues={issues} />
            <CardPreview
              draft={draft}
              logo={logo}
              galleryCount={gallery.length}
              audioCount={audio.length}
            />
          </div>

          <div className="flex flex-wrap gap-3 border-t border-border p-6">
            <Button
              onClick={confirmSave}
              disabled={errors.length > 0}
              className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
            >
              {editingId ? "Confirmar e salvar" : "Confirmar e publicar"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setReviewing(false)}
              className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
            >
              Voltar e ajustar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
