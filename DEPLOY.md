# Urb Concept — como baixar e hospedar em outro lugar

Este guia deixa o site rodando fora da Lovable, com **todas** as imagens, áudios e
funcionalidades intactas.

## 1. Baixar o código

Baixe o projeto pelo GitHub (recomendado) ou pelo botão de download da Lovable.
Requisitos na sua máquina: **Node.js 20+** (ou Bun).

```bash
npm install       # ou: bun install
```

## 2. Trazer as mídias para dentro do projeto

As imagens e áudios ficam no CDN da Lovable. Um script baixa tudo para `public/`,
mantendo os mesmos caminhos usados no código — não é preciso alterar nada:

```bash
npm run assets:download
```

Ao final, a pasta `public/__l5e/assets-v1/...` conterá todos os arquivos
(logos dos clientes, fotos dos cases, spots de rádio e episódio do programa).
Se algum download falhar, rode novamente apontando o domínio do preview:

```bash
ASSET_ORIGIN=https://SEU-PREVIEW.lovable.app npm run assets:download
```

Confira que esses arquivos entraram no seu repositório (não os coloque no
`.gitignore`), senão a hospedagem nova ficará sem as mídias.

## 3. Rodar localmente

```bash
npm run dev      # http://localhost:8080
```

## 4. Build de produção

```bash
npm run build
```

O projeto é **TanStack Start** (React + Vite) com SSR. O build gera a saída do
servidor em `.output/` (compatível com Node e com plataformas serverless).

## 5. Publicar

Escolha uma das opções:

| Hospedagem | Como fazer |
| --- | --- |
| **Vercel** | Importar o repositório. Build: `npm run build`. O preset é detectado automaticamente. |
| **Netlify** | Importar o repositório. Build: `npm run build`. |
| **Cloudflare Workers/Pages** | `npm run build` e publicar a saída de `.output/` com o Wrangler. |
| **VPS / servidor próprio** | `npm run build` e depois `node .output/server/index.mjs` atrás de um Nginx (proxy para a porta do processo). Use `pm2` para manter no ar. |

Nada de banco de dados, variável de ambiente obrigatória ou serviço externo:
o site é totalmente estático + SSR, sem backend próprio.

## 6. O que continua funcionando fora da Lovable

- Todas as seções da landing page, fontes e animações.
- Portfólio (Proof of Concept) com galerias e players de áudio.
- **Formulário 05 / Lead Capture**: abre o WhatsApp `+55 11 99157 3413` com a
  mensagem já preenchida com os dados do formulário. Para trocar o número, edite
  a constante `WHATSAPP_NUMBER` em `src/components/urb/LeadForm.tsx`.
- Rodapé com ícones do Instagram (`@urbconceptac`) e do WhatsApp.
- **Painel interno** em `/studio` (código de acesso `URB667`) para cadastrar novos
  cases arrastando imagens. Atenção: esses cases ficam salvos no `localStorage`
  do navegador usado — não são compartilhados entre dispositivos nem entre
  domínios diferentes. Se você quiser que os cases apareçam para todos os
  visitantes, eles precisam ser adicionados em `src/lib/cases.ts` (ou ligados a um
  banco de dados no futuro).

## 7. Domínio próprio

Aponte o DNS do domínio para a hospedagem escolhida (CNAME ou A record indicado
pelo painel dela). Depois, atualize a URL canônica em `src/routes/index.tsx` se
houver alguma referência absoluta.
