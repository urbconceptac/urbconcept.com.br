import { useCallback, useEffect, useState } from "react";
import { media } from "@/lib/media";

export type CapacidadeBlock = {
  index: string;
  title: string;
  description: string;
  bullets: string[];
};

export type ProcessoStep = {
  index: string;
  title: string;
  description: string;
};

export type SiteContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    image: string;
  };
  manifesto: {
    title: string;
    paragraphs: string[];
    image1: string;
    image1Caption: string;
    image2: string;
    image2Caption: string;
  };
  capacidades: CapacidadeBlock[];
  poc: {
    title: string;
    description: string;
  };
  processo: ProcessoStep[];
  lead: {
    title: string;
    description: string;
  };
  footer: {
    location: string;
    instagram: string;
    whatsapp: string;
    copyright: string;
  };
};

export const defaultContent: SiteContent = {
  hero: {
    eyebrow: "URB CONCEPT — Estúdio Criativo Multidisciplinar",
    title:
      "Design estratégico e produção audiovisual para marcas que exigem relevância duradoura.",
    subtitle:
      "Unimos precisão técnica, narrativa e identidade funcional para transformar posicionamento em ativo de negócio. Sem clichês. Sem excessos.",
    cta: "Agendar Reunião de Diagnóstico",
    image: media.press1,
  },
  manifesto: {
    title: "O mundo passa. A ideia fica.",
    paragraphs: [
      "Em um mercado saturado de ruído e execuções descartáveis, construímos ecossistemas visuais sólidos. A estética sem estratégia é passageira; a estrutura bem desenhada permanece.",
      "Atuamos na interseção entre comunicação visual, direção de arte e linguagem audiovisual. Desenvolvemos soluções com rigor técnico e acabamento refinado para empresas e projetos que buscam autoridade real no mercado.",
    ],
    image1: media.monk,
    image1Caption: "Estudo 01 — Permanência",
    image2: media.press2,
    image2Caption: "Estudo 02 — Atenção",
  },
  capacidades: [
    {
      index: "01",
      title: "Branding & Design Estratégico",
      description:
        "Construção e evolução de identidades visuais sistêmicas. Não entregamos apenas logotipos, desenhamos marcas prontas para escalabilidade e aplicação multimeios.",
      bullets: [
        "Sistemas de Identidade Visual & Diretrizes de Marca",
        "Design de Embalagens, Rótulos e Material Editorial",
        "Direção de Arte e Posicionamento Visual",
        "Design Digital e Interfaces de Alta Conversão",
      ],
    },
    {
      index: "02",
      title: "Produção Audiovisual & Áudio",
      description:
        "Narrativas em vídeo e em áudio construídas com linguagem cinematográfica, planejamento técnico e foco em comunicação institucional, comercial e jornalística.",
      bullets: [
        "Filmes Institucionais e Comerciais de Marca",
        "Produção de Áudio: Spots, Jingles e Locução Comercial",
        "Conteúdo para Rádio: Matérias, Reportagens e Programas",
        "Edição, Finalização e Pós-Produção",
        "Vinhetas, Motion Design e Aberturas",
      ],
    },
    {
      index: "03",
      title: "Projetos Especiais & Novos Negócios",
      description:
        "Estruturação de ideias antes da execução criativa. Trabalhamos junto ao empreendedor para transformar intenção em modelo viável e comunicável.",
      bullets: [
        "Ideação e Estruturação de Novos Negócios",
        "Naming, Arquitetura de Marca e Portfólio de Produtos",
        "Modelagem de Proposta de Valor e Posicionamento",
        "Materiais de Apresentação e Pitch para Investidores",
      ],
    },
    {
      index: "04",
      title: "Consultoria & Acompanhamento",
      description:
        "Suporte contínuo para times internos manterem a coerência do sistema criado, evitando desgaste e improviso na aplicação da marca.",
      bullets: [
        "Auditoria de Marca e Diagnóstico de Comunicação",
        "Diretrizes Editoriais e Calendário de Conteúdo",
        "Treinamento de Time Interno e Fornecedores",
        "Curadoria e Revisão de Peças em Produção",
      ],
    },
  ],
  poc: {
    title: "Marcas construídas com método.",
    description:
      "Cada projeto abaixo parte de um diagnóstico de negócio e termina em um sistema aplicável. Selecione um case para ver as lâminas do projeto e a leitura técnica da entrega.",
  },
  processo: [
    {
      index: "01",
      title: "Diagnóstico & Alinhamento",
      description: "Imersão no negócio, análise de gargalos e definição clara de objetivos.",
    },
    {
      index: "02",
      title: "Arquitetura & Estratégia",
      description:
        "Desenvolvimento de conceitos, direção de arte e estrutura técnica da entrega.",
    },
    {
      index: "03",
      title: "Execução & Produção",
      description: "Rigor técnico no design e na captação/edição audiovisual.",
    },
    {
      index: "04",
      title: "Implantação",
      description:
        "Entrega de arquivos finais organizados, guias de aplicação e suporte de implementação.",
    },
  ],
  lead: {
    title: "Inicie um Projeto",
    description:
      "Atendimento 100% online. Preencha os detalhes do seu projeto para alinharmos uma sessão de diagnóstico via Google Meet.",
  },
  footer: {
    location: "Cruzeiro do Sul / AC e São Paulo / SP.",
    instagram: "urbconceptac",
    whatsapp: "5511991573413",
    copyright: "© Urb Concept. Todos os direitos reservados.",
  },
};

const STORAGE_KEY = "urb-site-content";

function merge(base: SiteContent, patch: unknown): SiteContent {
  if (!patch || typeof patch !== "object") return base;
  const p = patch as Record<string, unknown>;
  return {
    hero: { ...base.hero, ...((p["hero"] as object) ?? {}) },
    manifesto: { ...base.manifesto, ...((p["manifesto"] as object) ?? {}) },
    capacidades: Array.isArray(p["capacidades"])
      ? (p["capacidades"] as CapacidadeBlock[])
      : base.capacidades,
    poc: { ...base.poc, ...((p["poc"] as object) ?? {}) },
    processo: Array.isArray(p["processo"]) ? (p["processo"] as ProcessoStep[]) : base.processo,
    lead: { ...base.lead, ...((p["lead"] as object) ?? {}) },
    footer: { ...base.footer, ...((p["footer"] as object) ?? {}) },
  };
}

function read(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContent;
    return merge(defaultContent, JSON.parse(raw));
  } catch {
    return defaultContent;
  }
}

/** Conteúdo editável do site, persistido no navegador (painel /studio). */
export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    setContent(read());
  }, []);

  const save = useCallback((next: SiteContent) => {
    setContent(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* quota excedida — mantém apenas em memória */
    }
  }, []);

  const reset = useCallback(() => {
    setContent(defaultContent);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  return { content, save, reset };
}
