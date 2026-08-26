import { useState } from "react";
import { AudioLines } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCases, type AudioTrack, type CaseItem } from "@/lib/cases";

function CaseMark({ item }: { item: CaseItem }) {
  if (item.icon === "wave" || !item.logo) {
    return (
      <div className="flex flex-col items-center gap-3 text-foreground">
        <AudioLines className="h-14 w-14 opacity-80" strokeWidth={1.25} />
        <span className="label-mono">Produção de Áudio</span>
      </div>
    );
  }

  return (
    <img
      src={item.logo}
      alt={`Logomarca ${item.client}`}
      loading="lazy"
      decoding="async"
      className={`max-h-24 w-full object-contain transition-opacity group-hover:opacity-100 ${
        item.logoIsWhite ? "opacity-80" : "opacity-70 grayscale brightness-[1.8] contrast-125"
      }`}
    />
  );
}

function CaseCard({ item, onOpen }: { item: CaseItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex aspect-[4/3] w-full flex-col justify-between border border-border bg-surface p-6 text-left transition-colors hover:border-foreground/40 hover:bg-surface-elevated"
    >
      <div className="flex items-start justify-between">
        <span className="label-mono">{item.year ?? "—"}</span>
        <span className="label-mono opacity-0 transition-opacity group-hover:opacity-100">
          Abrir ↗
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center px-2">
        <CaseMark item={item} />
      </div>

      <div className="border-t border-border pt-4">
        <p className="font-display text-sm font-semibold text-foreground">{item.client}</p>
        <p className="label-mono mt-1">{item.scope}</p>
      </div>

      <span className="pointer-events-none absolute left-3 top-3 h-2 w-2 border-l border-t border-border" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 border-b border-r border-border" />
    </button>
  );
}

function AudioBlock({ tracks }: { tracks: AudioTrack[] }) {
  return (
    <div className="border-t border-border p-6 md:p-8">
      <p className="label-mono">Faixas</p>
      <div className="mt-4 space-y-4">
        {tracks.map((t) => (
          <div key={t.src} className="border border-border bg-surface-elevated p-4">
            <div className="flex items-center gap-3">
              <AudioLines className="h-4 w-4 text-foreground" strokeWidth={1.5} />
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
                {t.label}
              </span>
            </div>
            <audio controls preload="none" src={t.src} className="mt-3 w-full">
              <track kind="captions" />
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CaseDialog({ item, onClose }: { item: CaseItem | null; onClose: () => void }) {
  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto rounded-none border-border bg-surface p-0">
        {item && (
          <div>
            <div className="border-b border-border p-6 md:p-8">
              <span className="label-mono">
                {item.scope} {item.year ? `— ${item.year}` : ""}
              </span>
              <DialogTitle className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {item.client}
              </DialogTitle>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
            </div>

            {item.gallery.length > 0 && (
              <div className="grid gap-px bg-border md:grid-cols-2">
                {item.gallery.map((src, i) => (
                  <div key={src + i} className="relative bg-surface-elevated">
                    <img
                      src={src}
                      alt={`${item.client} — lâmina ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    <span className="label-mono absolute bottom-3 left-3 bg-background/80 px-2 py-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {item.audio && item.audio.length > 0 && <AudioBlock tracks={item.audio} />}

            <div className="grid gap-8 border-t border-border p-6 md:grid-cols-2 md:p-8">
              <div>
                <p className="label-mono">Desafio</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.challenge}
                </p>
              </div>
              <div>
                <p className="label-mono">Solução</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.solution}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function CaseGrid() {
  const { cases } = useCases();
  const [active, setActive] = useState<CaseItem | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <CaseCard key={c.id} item={c} onOpen={() => setActive(c)} />
        ))}
      </div>

      <CaseDialog item={active} onClose={() => setActive(null)} />
    </>
  );
}
