import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  defaultContent,
  useSiteContent,
  type CapacidadeBlock,
  type ProcessoStep,
  type SiteContent,
} from "@/lib/site-content";
import { Field, ImagePicker, IssueList, SectionCard, type Issue } from "./fields";

function validate(d: SiteContent): Issue[] {
  const issues: Issue[] = [];
  const req = (ok: boolean, message: string) => {
    if (!ok) issues.push({ level: "erro", message });
  };
  const warn = (ok: boolean, message: string) => {
    if (!ok) issues.push({ level: "aviso", message });
  };

  req(!!d.hero.eyebrow.trim(), "Hero: linha de identificação vazia.");
  req(!!d.hero.title.trim(), "Hero: título vazio.");
  req(!!d.hero.subtitle.trim(), "Hero: subtítulo vazio.");
  req(!!d.hero.cta.trim(), "Hero: texto do botão vazio.");
  req(!!d.hero.image, "Hero: imagem de fundo ausente.");
  warn(d.hero.title.length <= 110, "Hero: título longo — pode ocupar mais linhas do que o previsto.");
  warn(d.hero.subtitle.length <= 200, "Hero: subtítulo longo — pode desequilibrar o bloco.");

  req(!!d.manifesto.title.trim(), "Manifesto: título vazio.");
  req(
    d.manifesto.paragraphs.some((p) => p.trim()),
    "Manifesto: ao menos um parágrafo precisa ter texto.",
  );
  req(!!d.manifesto.image1, "Manifesto: imagem do Estudo 01 ausente.");
  req(!!d.manifesto.image2, "Manifesto: imagem do Estudo 02 ausente.");
  req(!!d.manifesto.image1Caption.trim(), "Manifesto: legenda do Estudo 01 vazia.");
  req(!!d.manifesto.image2Caption.trim(), "Manifesto: legenda do Estudo 02 vazia.");

  d.capacidades.forEach((c, i) => {
    req(!!c.title.trim(), `Capacidades: bloco ${i + 1} sem título.`);
    req(!!c.description.trim(), `Capacidades: bloco ${i + 1} sem descrição.`);
    req(
      c.bullets.some((b) => b.trim()),
      `Capacidades: bloco ${i + 1} sem itens na lista.`,
    );
  });

  req(!!d.poc.title.trim(), "Proof of Concept: título vazio.");
  req(!!d.poc.description.trim(), "Proof of Concept: descrição vazia.");

  d.processo.forEach((p, i) => {
    req(!!p.title.trim(), `Metodologia: etapa ${i + 1} sem título.`);
    req(!!p.description.trim(), `Metodologia: etapa ${i + 1} sem descrição.`);
  });

  req(!!d.lead.title.trim(), "Lead Capture: título vazio.");
  req(!!d.lead.description.trim(), "Lead Capture: descrição vazia.");

  req(!!d.footer.location.trim(), "Rodapé: localização vazia.");
  req(
    d.footer.whatsapp.replace(/\D/g, "").length >= 10,
    "Rodapé: WhatsApp inválido — use números com DDI e DDD (ex.: 5511991573413).",
  );
  warn(
    !!d.footer.instagram.trim() &&
      !d.footer.instagram.includes("@") &&
      !d.footer.instagram.includes(" "),
    "Rodapé: Instagram sem @ e sem espaços (ex.: urbconceptac).",
  );
  req(!!d.footer.copyright.trim(), "Rodapé: copyright vazio.");

  return issues;
}

function normalize(draft: SiteContent): SiteContent {
  return {
    ...draft,
    manifesto: {
      ...draft.manifesto,
      paragraphs: draft.manifesto.paragraphs.map((p) => p.trim()).filter(Boolean),
    },
    capacidades: draft.capacidades.map((c) => ({
      ...c,
      bullets: c.bullets.map((b) => b.trim()).filter(Boolean),
    })),
    footer: {
      ...draft.footer,
      whatsapp: draft.footer.whatsapp.replace(/\D/g, ""),
      instagram: draft.footer.instagram.trim().replace(/^@/, ""),
    },
  };
}

function HeroPreview({ d }: { d: SiteContent }) {
  return (
    <div>
      <p className="label-mono mb-2">Prévia — Hero</p>
      <div className="relative h-52 overflow-hidden border border-border">
        <img
          src={d.hero.image}
          alt="Prévia do hero"
          className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="label-mono">{d.hero.eyebrow}</p>
          <p className="mt-2 font-display text-lg font-semibold leading-tight text-foreground">
            {d.hero.title}
          </p>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
            {d.hero.subtitle}
          </p>
          <span className="mt-3 inline-block border border-border bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">
            {d.hero.cta}
          </span>
        </div>
      </div>
    </div>
  );
}

function ManifestoPreview({ d }: { d: SiteContent }) {
  return (
    <div>
      <p className="label-mono mb-2">Prévia — Manifesto</p>
      <div className="grid grid-cols-3 gap-px border border-border bg-border">
        <figure className="col-span-2 bg-surface">
          <img
            src={d.manifesto.image1}
            alt="Prévia do Estudo 01"
            className="h-40 w-full object-cover grayscale"
          />
          <figcaption className="border-t border-border px-3 py-2">
            <span className="label-mono">{d.manifesto.image1Caption}</span>
          </figcaption>
        </figure>
        <figure className="bg-surface">
          <img
            src={d.manifesto.image2}
            alt="Prévia do Estudo 02"
            className="h-40 w-full object-cover grayscale"
          />
          <figcaption className="border-t border-border px-3 py-2">
            <span className="label-mono">{d.manifesto.image2Caption}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

export function ContentTab() {
  const { content, save, reset } = useSiteContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [dirty, setDirty] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!dirty) setDraft(content);
  }, [content, dirty]);

  const update = (patch: Partial<SiteContent>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true);
  };

  const updateCap = (i: number, patch: Partial<CapacidadeBlock>) => {
    const next = draft.capacidades.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    update({ capacidades: next });
  };

  const updateStep = (i: number, patch: Partial<ProcessoStep>) => {
    const next = draft.processo.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    update({ processo: next });
  };

  const issues = validate(draft);
  const errors = issues.filter((i) => i.level === "erro");

  function confirmSave() {
    save(normalize(draft));
    setDirty(false);
    setReviewing(false);
    toast.success("Conteúdo publicado no site.");
  }

  function onResetClick() {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    reset();
    setDirty(false);
    setConfirmReset(false);
    toast.success("Conteúdo restaurado para o padrão.");
  }

  return (
    <div className="space-y-10">
      {dirty && (
        <p className="label-mono border border-border bg-surface-elevated px-4 py-3">
          Alterações não publicadas — revise e publique para aplicar no site.
        </p>
      )}

      <SectionCard title="01 — Hero">
        <Field
          label="Identificação"
          value={draft.hero.eyebrow}
          onChange={(v) => update({ hero: { ...draft.hero, eyebrow: v } })}
        />
        <Field
          label="Título"
          multiline
          rows={2}
          value={draft.hero.title}
          onChange={(v) => update({ hero: { ...draft.hero, title: v } })}
        />
        <Field
          label="Subtítulo"
          multiline
          value={draft.hero.subtitle}
          onChange={(v) => update({ hero: { ...draft.hero, subtitle: v } })}
        />
        <Field
          label="Texto do botão"
          value={draft.hero.cta}
          onChange={(v) => update({ hero: { ...draft.hero, cta: v } })}
        />
        <ImagePicker
          label="Imagem de fundo"
          value={draft.hero.image}
          onChange={(url) => update({ hero: { ...draft.hero, image: url } })}
          onReset={() => update({ hero: { ...draft.hero, image: defaultContent.hero.image } })}
          note="Exibida em preto e branco com 70% de opacidade atrás do título."
        />
      </SectionCard>

      <SectionCard title="02 — Manifesto">
        <Field
          label="Título"
          value={draft.manifesto.title}
          onChange={(v) => update({ manifesto: { ...draft.manifesto, title: v } })}
        />
        {draft.manifesto.paragraphs.map((p, i) => (
          <Field
            key={i}
            label={`Parágrafo ${i + 1}`}
            multiline
            rows={4}
            value={p}
            onChange={(v) =>
              update({
                manifesto: {
                  ...draft.manifesto,
                  paragraphs: draft.manifesto.paragraphs.map((x, idx) => (idx === i ? v : x)),
                },
              })
            }
          />
        ))}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <ImagePicker
              label="Imagem — Estudo 01"
              value={draft.manifesto.image1}
              onChange={(url) => update({ manifesto: { ...draft.manifesto, image1: url } })}
              onReset={() =>
                update({ manifesto: { ...draft.manifesto, image1: defaultContent.manifesto.image1 } })
              }
              note="Lâmina grande, em preto e branco."
            />
            <div className="mt-3">
              <Field
                label="Legenda — Estudo 01"
                value={draft.manifesto.image1Caption}
                onChange={(v) => update({ manifesto: { ...draft.manifesto, image1Caption: v } })}
              />
            </div>
          </div>
          <div>
            <ImagePicker
              label="Imagem — Estudo 02"
              value={draft.manifesto.image2}
              onChange={(url) => update({ manifesto: { ...draft.manifesto, image2: url } })}
              onReset={() =>
                update({ manifesto: { ...draft.manifesto, image2: defaultContent.manifesto.image2 } })
              }
              note="Lâmina estreita, em preto e branco."
            />
            <div className="mt-3">
              <Field
                label="Legenda — Estudo 02"
                value={draft.manifesto.image2Caption}
                onChange={(v) => update({ manifesto: { ...draft.manifesto, image2Caption: v } })}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="03 — Capacidades & Serviços">
        <div className="grid gap-4 md:grid-cols-2">
          {draft.capacidades.map((c, i) => (
            <div key={c.index} className="space-y-4 border border-border p-5">
              <p className="label-mono">Bloco {c.index}</p>
              <Field label="Título" value={c.title} onChange={(v) => updateCap(i, { title: v })} />
              <Field
                label="Descrição"
                multiline
                rows={4}
                value={c.description}
                onChange={(v) => updateCap(i, { description: v })}
              />
              <Field
                label="Itens (um por linha)"
                multiline
                rows={5}
                value={c.bullets.join("\n")}
                onChange={(v) => updateCap(i, { bullets: v.split("\n") })}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="04 — Proof of Concept">
        <Field
          label="Título"
          value={draft.poc.title}
          onChange={(v) => update({ poc: { ...draft.poc, title: v } })}
        />
        <Field
          label="Descrição"
          multiline
          value={draft.poc.description}
          onChange={(v) => update({ poc: { ...draft.poc, description: v } })}
        />
      </SectionCard>

      <SectionCard title="05 — Metodologia">
        <div className="grid gap-4 md:grid-cols-2">
          {draft.processo.map((p, i) => (
            <div key={p.index} className="space-y-4 border border-border p-5">
              <p className="label-mono">Etapa {p.index}</p>
              <Field label="Título" value={p.title} onChange={(v) => updateStep(i, { title: v })} />
              <Field
                label="Descrição"
                multiline
                rows={3}
                value={p.description}
                onChange={(v) => updateStep(i, { description: v })}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="06 — Lead Capture">
        <Field
          label="Título"
          value={draft.lead.title}
          onChange={(v) => update({ lead: { ...draft.lead, title: v } })}
        />
        <Field
          label="Descrição"
          multiline
          value={draft.lead.description}
          onChange={(v) => update({ lead: { ...draft.lead, description: v } })}
        />
      </SectionCard>

      <SectionCard title="07 — Rodapé">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Localização"
            value={draft.footer.location}
            onChange={(v) => update({ footer: { ...draft.footer, location: v } })}
          />
          <Field
            label="Instagram (sem @)"
            value={draft.footer.instagram}
            onChange={(v) => update({ footer: { ...draft.footer, instagram: v } })}
          />
          <Field
            label="WhatsApp (DDI + DDD + número)"
            value={draft.footer.whatsapp}
            onChange={(v) => update({ footer: { ...draft.footer, whatsapp: v } })}
          />
          <Field
            label="Copyright"
            value={draft.footer.copyright}
            onChange={(v) => update({ footer: { ...draft.footer, copyright: v } })}
          />
        </div>
      </SectionCard>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Button
          onClick={() => setReviewing(true)}
          className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
        >
          Revisar e publicar
        </Button>
        <Button
          variant="outline"
          onClick={onResetClick}
          className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
        >
          {confirmReset ? "Confirmar restauração" : "Restaurar padrão"}
        </Button>
      </div>

      <Dialog open={reviewing} onOpenChange={setReviewing}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-none border-border bg-surface p-0">
          <div className="border-b border-border p-6">
            <span className="label-mono">Validação e prévia</span>
            <DialogTitle className="mt-2 font-display text-xl font-semibold text-foreground">
              Revisão antes de publicar
            </DialogTitle>
          </div>

          <div className="space-y-6 p-6">
            <IssueList issues={issues} />
            <HeroPreview d={draft} />
            <ManifestoPreview d={draft} />
            <div>
              <p className="label-mono mb-2">Resumo das demais seções</p>
              <ul className="space-y-px border border-border bg-border text-sm">
                <li className="bg-surface-elevated px-4 py-3 text-muted-foreground">
                  Capacidades: {draft.capacidades.map((c) => c.title || "—").join(" · ")}
                </li>
                <li className="bg-surface-elevated px-4 py-3 text-muted-foreground">
                  Metodologia: {draft.processo.map((p) => p.title || "—").join(" · ")}
                </li>
                <li className="bg-surface-elevated px-4 py-3 text-muted-foreground">
                  Rodapé: {draft.footer.location} — @{draft.footer.instagram} — WhatsApp{" "}
                  {draft.footer.whatsapp}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-border p-6">
            <Button
              onClick={confirmSave}
              disabled={errors.length > 0}
              className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
            >
              Confirmar e publicar
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
