#!/usr/bin/env node
/**
 * Baixa todas as mídias hospedadas no CDN da Lovable para dentro de `public/`,
 * mantendo exatamente o mesmo caminho (`/__l5e/assets-v1/<id>/<arquivo>`).
 *
 * Depois de rodar este script, o projeto fica 100% autossuficiente: nenhum
 * arquivo do site depende mais do CDN da Lovable, e o build pode ser hospedado
 * em qualquer serviço (Vercel, Netlify, Cloudflare, VPS, etc.).
 *
 * Uso:
 *   node scripts/download-assets.mjs
 *   ASSET_ORIGIN=https://seu-preview.lovable.app node scripts/download-assets.mjs
 */
import { readdir, readFile, mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const ASSETS_DIR = join(ROOT, "src/assets");
const PUBLIC_DIR = join(ROOT, "public");
const ORIGIN = (
  process.env.ASSET_ORIGIN || "https://id-preview--07adccea-dd6f-440d-b33b-439f613e884c.lovable.app"
).replace(/\/$/, "");

const pointers = (await readdir(ASSETS_DIR)).filter((f) => f.endsWith(".asset.json"));
if (!pointers.length) {
  console.log("Nenhum ponteiro .asset.json encontrado em src/assets.");
  process.exit(0);
}

let ok = 0;
let skipped = 0;
const failed = [];

for (const file of pointers) {
  const pointer = JSON.parse(await readFile(join(ASSETS_DIR, file), "utf8"));
  const target = join(PUBLIC_DIR, pointer.url.replace(/^\//, ""));

  try {
    const existing = await stat(target);
    if (existing.size > 0) {
      skipped++;
      continue;
    }
  } catch {
    /* ainda não baixado */
  }

  const url = `${ORIGIN}${pointer.url}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, Buffer.from(await res.arrayBuffer()));
    ok++;
    console.log(`baixado  ${pointer.original_filename}`);
  } catch (err) {
    failed.push(`${pointer.original_filename} (${url}): ${err.message}`);
  }
}

console.log(`\n${ok} baixado(s), ${skipped} já existia(m), ${failed.length} falha(s).`);
if (failed.length) {
  console.error("\nFalhas:\n" + failed.map((f) => ` - ${f}`).join("\n"));
  process.exit(1);
}
