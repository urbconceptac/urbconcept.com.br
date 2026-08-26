import { useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fileToDataUrl } from "@/lib/cases";

export type Issue = { level: "erro" | "aviso"; message: string };

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-border bg-surface p-6 md:p-8">
      <p className="label-mono">{title}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
};

export function Field({ label, value, onChange, multiline = false, rows = 3, placeholder }: FieldProps) {
  return (
    <label className="block">
      <span className="label-mono">{label}</span>
      {multiline ? (
        <Textarea
          rows={rows}
          placeholder={placeholder}
          className="mt-2 rounded-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          placeholder={placeholder}
          className="mt-2 rounded-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

type ImagePickerProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onReset?: () => void;
  note?: string;
};

export function ImagePicker({ label, value, onChange, onReset, note }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="label-mono">{label}</p>
      <div className="mt-2 flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden border border-border bg-surface-elevated">
          {value ? (
            <img src={value} alt={label} className="h-full w-full object-cover" />
          ) : (
            <span className="label-mono">vazio</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-none font-mono text-[10px] uppercase tracking-[0.16em]"
            onClick={() => inputRef.current?.click()}
          >
            Trocar imagem
          </Button>
          {onReset && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-none font-mono text-[10px] uppercase tracking-[0.16em]"
              onClick={onReset}
            >
              Padrão
            </Button>
          )}
        </div>
      </div>
      {note && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) onChange(await fileToDataUrl(f));
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function IssueList({ issues }: { issues: Issue[] }) {
  if (!issues.length) {
    return (
      <p className="border border-border bg-surface-elevated p-4 text-sm text-muted-foreground">
        Nenhum problema encontrado. O conteúdo está pronto para publicação.
      </p>
    );
  }
  return (
    <ul className="space-y-px border border-border bg-border">
      {issues.map((i, idx) => (
        <li key={idx} className="flex gap-3 bg-surface-elevated px-4 py-3 text-sm">
          <span
            className={`label-mono shrink-0 ${
              i.level === "erro" ? "text-destructive" : "text-foreground"
            }`}
          >
            {i.level === "erro" ? "Erro" : "Aviso"}
          </span>
          <span className="text-muted-foreground">{i.message}</span>
        </li>
      ))}
    </ul>
  );
}
