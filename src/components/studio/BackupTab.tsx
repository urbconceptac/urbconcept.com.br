import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { backupSummary, exportBackup, importBackup, validateBackup } from "@/lib/backup";
import { SectionCard } from "./fields";

export function BackupTab() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<unknown>(null);

  async function onFile(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    try {
      const parsed: unknown = JSON.parse(await f.text());
      const error = validateBackup(parsed);
      if (error) {
        toast.error(error);
        return;
      }
      setPending(parsed);
    } catch {
      toast.error("Não foi possível ler o arquivo. Envie o JSON exportado por este painel.");
    }
  }

  function confirmImport() {
    const applied = importBackup(pending);
    setPending(null);
    toast.success(`${applied} conjunto(s) de conteúdo importado(s). Recarregando…`);
    setTimeout(() => window.location.reload(), 800);
  }

  return (
    <div className="space-y-10">
      <SectionCard title="Exportar conteúdo">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Baixa um arquivo JSON com todo o conteúdo editável: textos do site, cases adicionados,
          modificações nos cases fixos e as imagens e áudios enviados pelo painel (embutidos no
          arquivo). Use para migrar o conteúdo para outra hospedagem ou outro navegador.
        </p>
        <div>
          <Button
            onClick={exportBackup}
            className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
          >
            Baixar backup (.json)
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Importar conteúdo">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Restaura um backup exportado anteriormente. A importação substitui todo o conteúdo
          editável atual do navegador — você confirma um resumo antes de aplicar.
        </p>
        <div>
          <Button
            variant="outline"
            onClick={() => inputRef.current?.click()}
            className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
          >
            Selecionar backup (.json)
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              void onFile(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </SectionCard>

      <Dialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent className="max-w-lg rounded-none border-border bg-surface p-0">
          <div className="border-b border-border p-6">
            <span className="label-mono">Confirmação</span>
            <DialogTitle className="mt-2 font-display text-xl font-semibold text-foreground">
              Importar este backup?
            </DialogTitle>
          </div>
          <div className="p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              O conteúdo editável atual será substituído por:
            </p>
            <ul className="mt-4 space-y-px border border-border bg-border">
              {pending !== null &&
                backupSummary(pending).map((line) => (
                  <li
                    key={line}
                    className="bg-surface-elevated px-4 py-3 text-sm text-muted-foreground"
                  >
                    {line}
                  </li>
                ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3 border-t border-border p-6">
            <Button
              onClick={confirmImport}
              className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
            >
              Confirmar importação
            </Button>
            <Button
              variant="outline"
              onClick={() => setPending(null)}
              className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
