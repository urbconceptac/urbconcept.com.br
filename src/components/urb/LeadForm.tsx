import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/whatsapp";

const inputClass =
  "w-full rounded-none border border-input bg-surface-elevated px-4 py-3 text-sm text-foreground placeholder:text-subtle outline-none transition-colors focus:border-foreground";

const labelClass = "label-mono block mb-2";

export function LeadForm() {
  return (
    <form
      className="grid gap-6 border border-border bg-surface p-6 md:p-10"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const get = (k: string) => String(data.get(k) ?? "").trim();

        const message = [
          `Olá! Vi o site da URB e gostaria de fazer um orçamento rápido para ${get("servico")}.`,
          "",
          `Nome: ${get("nome")}`,
          `WhatsApp: ${get("telefone")}`,
        ].join("\n");

        window.open(whatsappLink(message), "_blank", "noopener,noreferrer");

        toast.success("Conversa aberta no WhatsApp", {
          description: "A mensagem já vai preenchida. Basta enviar.",
        });
        form.reset();
      }}
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="nome">
            Nome
          </label>
          <input id="nome" name="nome" type="text" required className={inputClass} placeholder="Seu nome" />
        </div>
        <div>
          <label className={labelClass} htmlFor="telefone">
            WhatsApp / Telefone
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            required
            className={inputClass}
            placeholder="(11) 99999-0000"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="servico">
            Qual serviço precisa
          </label>
          <select id="servico" name="servico" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Selecione
            </option>
            <option>Design / Identidade Visual</option>
            <option>Produção de Vídeo</option>
            <option>Produção de Áudio / Rádio</option>
            <option>Projeto Integrado</option>
          </select>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-none bg-whatsapp font-mono text-[11px] uppercase tracking-[0.18em] text-whatsapp-foreground hover:bg-whatsapp/90 md:w-auto"
      >
        <MessageCircle className="mr-2 h-4 w-4" strokeWidth={2} />
        Iniciar conversa no WhatsApp
      </Button>
    </form>
  );
}
