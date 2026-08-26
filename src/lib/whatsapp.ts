export const WHATSAPP_NUMBER = "5511991573413";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá! Vi o site da URB e gostaria de fazer um orçamento rápido para [Design / Vídeo / Marca].";

/** Monta o link do WhatsApp já com a mensagem pré-pronta. */
export function whatsappLink(message: string = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
}
