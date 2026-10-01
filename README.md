# SnapStudio

Editor expresso de vlogs diários, GRWM e rotina. Uma base Next.js (App Router) compartilhada entre **Web PWA**, **mobile (Capacitor)** e **desktop (Tauri/Electron)**.

O arquivo do Figma Make estava inacessível nesta sessão, então a UI segue o fluxo das quatro telas do protótipo (import/timeline → presets/preview → export) com paleta dark + blush, mobile-first e layout em split no desktop.

## Stack

- Next.js 15, React 19, TypeScript
- Tailwind CSS 4, Lucide, Framer Motion
- Zustand + services/repository em memória (sem banco nesta fase)
- Docker / Docker Compose
- Capacitor e Tauri preparados (wrappers nativos na próxima fase)

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

### Docker

```bash
docker compose up web
```

Desenvolvimento containerizado:

```bash
docker compose up dev
```

## Estrutura

```
src/app/        páginas App Router (/, /studio, /export) e API routes
src/components/ UI reutilizável (touch + cursor)
src/services/   clipService, storageService, presetService, platform
src/types/      Clip, Preset, ExportOptions, VlogProject, ProjectRepository
src/store/      estado da sessão (Zustand)
desktop/        tauri.conf.json (architecture-ready)
capacitor.config.ts
```

## Plataformas

| Alvo | Estado atual |
| --- | --- |
| Web | Next.js + PWA (`manifest.json` + service worker) |
| Mobile | `capacitor.config.ts` + `storageService` com ponto de plugin da galeria nativa |
| Desktop | `desktop/tauri.conf.json` + detecção `__TAURI__` / Electron |

Para gerar apps nativos depois: `npx cap add android|ios` e um projeto Tauri apontando para o `devUrl` em `desktop/tauri.conf.json`.
