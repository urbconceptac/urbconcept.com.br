import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseGrid } from "@/components/urb/CaseGrid";
import { Header } from "@/components/urb/Header";
import { LeadForm } from "@/components/urb/LeadForm";
import { media } from "@/lib/media";
import { useSiteContent } from "@/lib/site-content";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Urb Concept — Estúdio de Branding e Audiovisual" },
      {
        name: "description",
        content:
          "Design estratégico e produção audiovisual para marcas que exigem relevância duradoura. Estúdio criativo multidisciplinar em São Paulo.",
      },
      { property: "og:title", content: "Urb Concept — Estúdio de Branding e Audiovisual" },
      {
        property: "og:description",
        content:
          "Branding sistêmico, direção de arte e produção audiovisual com rigor técnico. Agende uma reunião de diagnóstico.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <div className="mb-10 flex items-center gap-4 border-b border-border pb-4">
      <span className="label-mono">{index}</span>
      <span className="label-mono">{children}</span>
    </div>
  );
}

function Index() {
  const { content } = useSiteContent();
  const { hero, manifesto, capacidades, poc, processo, lead, footer } = content;

  return (
    <div id="top" className="min-h-screen bg-background">
      <Header />

      <main>
        {/* B. HERO */}
        <section className="relative flex min-h-[92vh] items-end overflow-hidden pt-16">
          <div className="absolute inset-0">
            <img
              src={hero.image}
              alt="Multidão de câmeras apontadas para uma única figura"
              width={1664}
              height={2496}
              className="h-full w-full object-cover opacity-70 grayscale"
            />
            <div className="hero-overlay absolute inset-0" />
          </div>

          <div className="relative mx-auto grid w-full max-w-[1200px] gap-12 px-6 py-20 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="label-mono">{hero.eyebrow}</p>
              <h1 className="mt-6 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {hero.title}
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {hero.subtitle}
              </p>
              <Button
                asChild
                size="lg"
                className="mt-10 rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
              >
                <a href="#iniciar-projeto">{hero.cta}</a>
              </Button>
            </div>
          </div>
        </section>


        {/* C. MANIFESTO */}
        <section id="manifesto" className="border-t border-border py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <SectionLabel index="01">Manifesto</SectionLabel>
            <div className="grid gap-12 lg:grid-cols-12">
              <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:col-span-5">
                {manifesto.title}
              </h2>
              <div className="space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base lg:col-span-7">
                {manifesto.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>

            <div className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">
              <figure className="flex flex-col bg-surface md:col-span-2">
                <div className="relative h-[340px] overflow-hidden md:h-[560px]">
                  <img
                    src={manifesto.image1}
                    alt="Figura serena em meio a uma multidão em movimento"
                    width={768}
                    height={1139}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover grayscale"
                  />
                </div>
                <figcaption className="flex items-center justify-between border-t border-border px-5 py-4">
                  <span className="label-mono">{manifesto.image1Caption}</span>
                  <span className="label-mono">Ref. 002</span>
                </figcaption>
              </figure>
              <figure className="flex flex-col bg-surface">
                <div className="relative h-[420px] overflow-hidden md:h-[560px]">
                  <img
                    src={manifesto.image2}
                    alt="Retrato em meio a uma multidão em movimento"
                    width={566}
                    height={1024}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover grayscale"
                  />
                </div>
                <figcaption className="flex items-center justify-between border-t border-border px-5 py-4">
                  <span className="label-mono">{manifesto.image2Caption}</span>
                  <span className="label-mono">Ref. 003</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>



        {/* D. CAPACIDADES */}
        <section id="capacidades" className="border-t border-border py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <SectionLabel index="02">Capacidades & Serviços</SectionLabel>
            <div className="grid gap-px border border-border bg-border md:grid-cols-2">
              {capacidades.map((c) => (
                <article key={c.index} className="bg-surface p-8 md:p-10">
                  <span className="label-mono">Bloco {c.index}</span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-foreground sm:text-2xl">
                    {c.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                  <ul className="mt-8 space-y-px">
                    {c.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-4 border-t border-border py-3 text-sm text-foreground"
                      >
                        <span className="text-subtle">—</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* E. PROOF OF CONCEPT */}
        <section id="proof-of-concept" className="border-t border-border py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <SectionLabel index="03">Proof of Concept</SectionLabel>
            <div className="grid gap-8 lg:grid-cols-12">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:col-span-5">
                {poc.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base lg:col-span-7">
                {poc.description}
              </p>
            </div>
            <div className="mt-12">
              <CaseGrid />
            </div>
          </div>
        </section>


        {/* F. METODOLOGIA */}
        <section id="processo" className="border-t border-border py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <SectionLabel index="04">Metodologia</SectionLabel>
            <div className="grid gap-px border-t border-border sm:grid-cols-2 lg:grid-cols-4">
              {processo.map((p) => (
                <div key={p.index} className="border-b border-border bg-surface p-8 lg:border-l">
                  <span className="font-mono text-2xl text-subtle">{p.index}</span>
                  <h3 className="mt-6 font-display text-base font-semibold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* G. LEAD CAPTURE */}
        <section id="iniciar-projeto" className="border-t border-border py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <SectionLabel index="05">Lead Capture</SectionLabel>
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {lead.title}
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  {lead.description}
                </p>
              </div>
              <div className="lg:col-span-8">
                <LeadForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* H. FOOTER */}
      <footer className="border-t border-border py-16">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:grid-cols-3">
          <div>
            <img
              src={media.logo}
              alt="Símbolo Urb Concept"
              width={112}
              height={112}
              loading="lazy"
              className="h-24 w-24 object-contain"
            />
          </div>

          <div>
            <p className="label-mono">Localização</p>
            <p className="mt-3 text-sm text-muted-foreground">{footer.location}</p>
          </div>
          <div>
            <p className="label-mono">Contato</p>
            <div className="mt-3 flex items-center gap-3">
              <a
                href={`https://instagram.com/${footer.instagram}`}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Instagram @${footer.instagram}`}
                title={`Instagram @${footer.instagram}`}
                className="flex h-11 w-11 items-center justify-center border border-border bg-surface text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href={`https://wa.me/${footer.whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="WhatsApp"
                title="WhatsApp"
                className="flex h-11 w-11 items-center justify-center border border-border bg-surface text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>

        </div>
        <div className="mx-auto mt-12 max-w-[1200px] border-t border-border px-6 pt-6">
          <p className="label-mono">{footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
