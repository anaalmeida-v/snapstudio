"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PreviewPlayer } from "@/components/player/PreviewPlayer";
import { AiToggles } from "@/components/presets/AiToggles";
import { PresetSelector } from "@/components/presets/PresetSelector";
import { useProjectStore } from "@/store/projectStore";

export default function StudioPage() {
  const clipCount = useProjectStore((state) => state.project.clips.length);

  return (
    <AppShell step={1}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div>
          <h1 className="font-serif text-3xl text-cream">Escolha o estilo</h1>
          <p className="mt-1 text-sm text-muted">
            Presets do protótipo + automações mock de IA.
          </p>
          <div className="mt-6">
            <PresetSelector />
          </div>
          <AiToggles />
          <div className="mt-6 flex gap-3">
            <Link
              href="/"
              className="rounded-full border border-cream/15 px-5 py-3 text-sm text-cream"
            >
              Voltar
            </Link>
            <Link
              href="/export"
              className={`rounded-full px-5 py-3 text-sm font-semibold ${
                clipCount === 0
                  ? "pointer-events-none bg-cream/10 text-muted"
                  : "bg-cream text-ink"
              }`}
            >
              Ir para exportar
            </Link>
          </div>
        </div>
        <PreviewPlayer />
      </div>
    </AppShell>
  );
}
