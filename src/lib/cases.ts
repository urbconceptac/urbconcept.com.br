import { useCallback, useEffect, useState } from "react";
import { media } from "@/lib/media";

export type AudioTrack = { label: string; src: string };

export type CaseItem = {
  id: string;
  client: string;
  scope: string;
  year?: string;
  logo?: string;
  /** true when the logo art is already monochrome/white */
  logoIsWhite: boolean;
  /** renders an audio-wave mark instead of a client logo */
  icon?: "wave";
  summary: string;
  challenge: string;
  solution: string;
  gallery: string[];
  audio?: AudioTrack[];
  custom?: boolean;
};

export const defaultCases: CaseItem[] = [
  {
    id: "lobao-morais",
    client: "Lobão Morais Advogados",
    scope: "Branding / Identidade Verbal",
    year: "2025",
    logo: media.lobao.logo,
    logoIsWhite: true,
    summary:
      "Reconstrução de identidade para uma banca de advocacia que precisava comunicar tradição sem parecer datada.",
    challenge:
      "A marca anterior misturava referências clássicas e sinais gráficos genéricos do setor jurídico, dificultando o reconhecimento em ambientes digitais e a aplicação em papelaria e redes sociais.",
    solution:
      "Desenvolvemos um sistema de identidade completo: logotipo tipográfico com estrutura moderna mantendo o padrão cromático de confiança, paleta institucional, hierarquia tipográfica, papelaria (cartão, timbrado, pasta) e diretrizes de aplicação para conteúdo digital e social.",
    gallery: media.lobao.gallery,
  },
  {
    id: "drogaria-turquesa",
    client: "Drogaria Turquesa",
    scope: "Branding / Ambientação / Campanha",
    year: "2025",
    logo: media.turquesa.logo,
    logoIsWhite: true,
    summary:
      "Identidade de varejo farmacêutico construída para se destacar em uma categoria dominada por verde e azul.",
    challenge:
      "Criar uma marca de drogaria independente capaz de competir visualmente com redes nacionais, com aplicação imediata em fachada, uniformes, crachás e material de ponto de venda.",
    solution:
      "Símbolo de cruz entrelaçada em turquesa e violeta, sistema cromático proprietário e kit completo de aplicação: fachada, ambientação interna, uniformes, crachás e cartazes promocionais de alto contraste.",
    gallery: media.turquesa.gallery,
  },
  {
    id: "667-polpetteria",
    client: "667 Polpetteria",
    scope: "Packaging / Rótulos",
    year: "2025",
    logo: media.polpetteria.logo,
    logoIsWhite: false,
    summary:
      "Linha de rótulos para os tapenades da casa. A marca já existia; o escopo aqui foi exclusivamente o rótulo do produto.",
    challenge:
      "Levar um produto artesanal para a prateleira com presença visual e informação legal correta, respeitando a identidade já consolidada da casa e sem cair na estética genérica de produto gourmet.",
    solution:
      "Rótulo em fundo escuro com detalhes dourados, hierarquia clara de sabor, ingredientes de destaque e gramatura, estrutura modular pronta para novos sabores da linha e adequação de conteúdo obrigatório para envase em vidro de 200g.",
    gallery: media.polpetteria.gallery,
  },
  {
    id: "toca-que-tem-historia",
    client: "Toca Que Tem História",
    scope: "Produção Original / Rádio & Áudio",
    year: "2026",
    logoIsWhite: true,
    icon: "wave",
    summary:
      "Programa documental de rádio, produção original URB Concept: canções conhecidas como porta de entrada para histórias culturais, sociais e curiosidades pouco contadas.",
    challenge:
      "Criar um formato autoral de áudio que não soasse institucional nem acadêmico, com nome coloquial e apelo amplo de gênero musical, sustentando episódios de pesquisa densa em linguagem falada.",
    solution:
      "Naming, roteirização, pesquisa, locução e branding sonoro: vinheta de assinatura com scratch de vinil abrindo em batida lo-fi e corte seco — um selo de áudio, não trilha de fundo. Cinco episódios produzidos, com passagem de humanização de texto em cada roteiro.",
    gallery: [],
    audio: media.tqth.audio,
  },
  {
    id: "a-cruzeirense-magazine",
    client: "A Cruzeirense Magazine",
    scope: "Roteiro / Spot / Edição de Áudio",
    year: "2026",
    logo: media.cruzeirense.logo,
    logoIsWhite: true,
    summary:
      "Produção continuada de spots publicitários para rádio: roteiro, direção de locução, edição e mixagem.",
    challenge:
      "Sustentar campanhas de varejo com trocas semanais de oferta mantendo reconhecimento imediato da marca no ar, dentro dos tempos comerciais de 30 e 45 segundos.",
    solution:
      "Estrutura fixa de abertura e assinatura sonora com miolo variável por campanha, ritmo de leitura calibrado para rádio AM/FM e mixagem com compressão adequada à transmissão.",
    gallery: media.cruzeirense.gallery,
    audio: media.cruzeirense.spots,
  },
];

export const CUSTOM_CASES_KEY = "urb-custom-cases";
export const CASE_OVERRIDES_KEY = "urb-case-overrides";
export const HIDDEN_CASES_KEY = "urb-case-hidden";

const STORAGE_KEY = CUSTOM_CASES_KEY;
const OVERRIDES_KEY = CASE_OVERRIDES_KEY;
const HIDDEN_KEY = HIDDEN_CASES_KEY;

type Overrides = Record<string, Partial<CaseItem>>;

function read(): CaseItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CaseItem[]) : [];
  } catch {
    return [];
  }
}

function readOverrides(): Overrides {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Overrides) : {};
  } catch {
    return {};
  }
}

function readHidden(): string[] {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota excedida — mantém apenas em memória */
  }
}

export function useCases() {
  const [custom, setCustom] = useState<CaseItem[]>([]);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    setCustom(read());
    setOverrides(readOverrides());
    setHidden(readHidden());
  }, []);

  const addCase = useCallback((item: Omit<CaseItem, "id" | "custom">) => {
    const next = [...read(), { ...item, id: `custom-${Date.now()}`, custom: true }];
    setCustom(next);
    write(STORAGE_KEY, next);
  }, []);

  const removeCase = useCallback((id: string) => {
    if (defaultCases.some((c) => c.id === id)) {
      const next = [...new Set([...readHidden(), id])];
      setHidden(next);
      write(HIDDEN_KEY, next);
      return;
    }
    const next = read().filter((c) => c.id !== id);
    setCustom(next);
    write(STORAGE_KEY, next);
  }, []);

  const restoreCase = useCallback((id: string) => {
    const nextHidden = readHidden().filter((h) => h !== id);
    setHidden(nextHidden);
    write(HIDDEN_KEY, nextHidden);
    const nextOverrides = { ...readOverrides() };
    delete nextOverrides[id];
    setOverrides(nextOverrides);
    write(OVERRIDES_KEY, nextOverrides);
  }, []);

  /** Atualiza qualquer case (fixo ou adicionado) sem alterar a estrutura do site. */
  const updateCase = useCallback((id: string, patch: Partial<CaseItem>) => {
    if (defaultCases.some((c) => c.id === id)) {
      const next = { ...readOverrides(), [id]: { ...readOverrides()[id], ...patch } };
      setOverrides(next);
      write(OVERRIDES_KEY, next);
      return;
    }
    const next = read().map((c) => (c.id === id ? { ...c, ...patch } : c));
    setCustom(next);
    write(STORAGE_KEY, next);
  }, []);

  const cases = [
    ...defaultCases.filter((c) => !hidden.includes(c.id)).map((c) => ({ ...c, ...overrides[c.id] })),
    ...custom,
  ];

  return {
    cases,
    custom,
    hidden,
    overridden: Object.keys(overrides),
    addCase,
    removeCase,
    restoreCase,
    updateCase,
  };
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo"));
    reader.readAsDataURL(file);
  });
}
