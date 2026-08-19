import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-none border border-input bg-surface-elevated px-4 py-3 text-sm text-foreground placeholder:text-subtle outline-none transition-colors focus:border-foreground";

const labelClass = "label-mono block mb-2";

const WHATSAPP_NUMBER = "5511991573413";

export function LeadForm() {
  const [scope, setScope] = useState("Projeto Integrado");

  return (
    <form
      className="grid gap-6 border border-border bg-surface p-6 md:p-10"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const get = (k: string) => String(data.get(k) ?? "").trim();

        const message = [
          "*Nova solicitação — Urb Concept*",
          `Nome: ${get("nome")}`,
          `E-mail: ${get("email")}`,
          `Empresa: ${get("empresa")}`,
          `Cargo: ${get("cargo")}`,
          `Escopo: ${get("escopo")}`,
          `Orçamento: ${get("orcamento")}`,
          "",
          "Desafio / Prazo:",
          get("desafio"),
        ].join("\n");

        window.open(
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
          "_blank",
          "noopener,noreferrer",
        );

        toast.success("Solicitação enviada para o WhatsApp", {
          description: "A conversa foi aberta com os dados preenchidos. Basta enviar a mensagem.",
        });
        form.reset();
        setScope("Projeto Integrado");
      }}
    >

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="nome">
            Nome Completo
          </label>
          <input id="nome" name="nome" type="text" required className={inputClass} placeholder="Seu nome" />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            E-mail Corporativo
          </label>
          <input id="email" name="email" type="email" required className={inputClass} placeholder="nome@empresa.com" />
        </div>
        <div>
          <label className={labelClass} htmlFor="empresa">
            Empresa / Marca
          </label>
          <input id="empresa" name="empresa" type="text" required className={inputClass} placeholder="Marca" />
        </div>
        <div>
          <label className={labelClass} htmlFor="cargo">
            Cargo
          </label>
          <select id="cargo" name="cargo" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Selecione
            </option>
            <option>Solicitante</option>
            <option>Diretor</option>
            <option>Sócio</option>
            <option>Gerente de Marketing</option>
          </select>
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Escopo Principal</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {["Branding & Design", "Produção Audiovisual", "Projeto Integrado"].map((opt) => (
            <label
              key={opt}
              className={`cursor-pointer border px-4 py-3 text-sm transition-colors ${
                scope === opt
                  ? "border-foreground bg-accent text-foreground"
                  : "border-input bg-surface-elevated text-muted-foreground hover:text-foreground"
              }`}
            >
              <input
                type="radio"
                name="escopo"
                value={opt}
                checked={scope === opt}
                onChange={() => setScope(opt)}
                className="sr-only"
              />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="orcamento">
            Orçamento Estimado
          </label>
          <select id="orcamento" name="orcamento" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Selecione
            </option>
            <option>Até R$ 10k</option>
            <option>R$ 10k a R$ 30k</option>
            <option>Acima de R$ 30k</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="desafio">
          Resumo do Desafio / Prazo
        </label>
        <textarea
          id="desafio"
          name="desafio"
          rows={5}
          required
          className={inputClass}
          placeholder="Contexto do projeto, entregáveis esperados e prazo."
        />
      </div>

      <Button type="submit" size="lg" className="w-full rounded-none font-mono text-[11px] uppercase tracking-[0.18em] md:w-auto">
        Enviar Solicitação
      </Button>
    </form>
  );
}
