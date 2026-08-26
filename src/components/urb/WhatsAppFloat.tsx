import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

/** Botão flutuante fixo de WhatsApp, visível em todas as dobras. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Falar no WhatsApp"
      title="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-full bg-whatsapp px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03] sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-6 w-6 shrink-0" strokeWidth={2} />
      <span className="hidden sm:inline">Falar no WhatsApp</span>
    </a>
  );
}
