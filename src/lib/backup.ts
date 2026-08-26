import { CASE_OVERRIDES_KEY, CUSTOM_CASES_KEY, HIDDEN_CASES_KEY } from "@/lib/cases";
import { SITE_CONTENT_KEY } from "@/lib/site-content";

const KEYS = {
  siteContent: SITE_CONTENT_KEY,
  customCases: CUSTOM_CASES_KEY,
  caseOverrides: CASE_OVERRIDES_KEY,
  hiddenCases: HIDDEN_CASES_KEY,
} as const;

export type BackupFile = {
  app: "urb-concept";
  version: 1;
  exportedAt: string;
  data: Partial<Record<keyof typeof KEYS, unknown>>;
};

/** Gera e baixa um JSON com todo o conteúdo editável (textos, cases e mídias em base64). */
export function exportBackup(): void {
  const data: BackupFile["data"] = {};
  for (const [label, key] of Object.entries(KEYS)) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        data[label as keyof typeof KEYS] = JSON.parse(raw);
      } catch {
        /* ignora entrada corrompida */
      }
    }
  }
  const payload: BackupFile = {
    app: "urb-concept",
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `urb-concept-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function validateBackup(parsed: unknown): string | null {
  if (!parsed || typeof parsed !== "object") return "Arquivo inválido: não é um JSON de backup.";
  const p = parsed as Record<string, unknown>;
  if (p["app"] !== "urb-concept") return "Este arquivo não é um backup da Urb Concept.";
  if (p["version"] !== 1) return "Versão de backup não suportada.";
  if (!p["data"] || typeof p["data"] !== "object") return "O backup não contém dados.";
  return null;
}

/**
 * Restaura o backup: aplica cada conjunto presente e limpa os ausentes,
 * reproduzindo exatamente o estado exportado.
 */
export function importBackup(parsed: unknown): number {
  const p = parsed as BackupFile;
  let applied = 0;
  for (const [label, key] of Object.entries(KEYS)) {
    const value = p.data[label as keyof typeof KEYS];
    if (value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      applied += 1;
    }
  }
  return applied;
}

export function backupSummary(parsed: unknown): string[] {
  const p = parsed as BackupFile;
  const lines: string[] = [];
  const d = p.data;
  if (d.siteContent) lines.push("Conteúdo do site (textos e imagens)");
  if (Array.isArray(d.customCases)) lines.push(`Cases adicionados (${d.customCases.length})`);
  if (d.caseOverrides && typeof d.caseOverrides === "object")
    lines.push(`Cases modificados (${Object.keys(d.caseOverrides).length})`);
  if (Array.isArray(d.hiddenCases)) lines.push(`Cases ocultos (${d.hiddenCases.length})`);
  return lines.length ? lines : ["Backup vazio — restaura tudo para o padrão."];
}
