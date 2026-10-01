"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, Music2, Video } from "lucide-react";
import { formatDuration } from "@/lib/format";
import { useProjectStore } from "@/store/projectStore";
import type { ExportDestination, ExportStats } from "@/types";

export function ExportDashboard() {
  const project = useProjectStore((state) => state.project);
  const [progress, setProgress] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState<ExportStats | null>(null);
  const [destination, setDestination] = useState<ExportDestination | null>(null);

  const rawDuration = useMemo(
    () => project.clips.reduce((sum, clip) => sum + clip.durationMs, 0),
    [project.clips],
  );

  async function exportTo(next: ExportDestination) {
    setDestination(next);
    setExporting(true);
    setProgress(8);
    setStats(null);

    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(92, value + 8));
    }, 180);

    const response = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clipCount: project.clips.length,
        totalDurationMs: rawDuration,
        ai: project.ai,
      }),
    });
    const data = (await response.json()) as ExportStats;
    window.clearInterval(timer);
    setStats(data);
    setProgress(100);
    setExporting(false);
  }

  const cards = [
    {
      label: "Duração total",
      value: formatDuration(stats?.totalDurationMs ?? rawDuration),
    },
    {
      label: "Vídeos unidos",
      value: String(stats?.clipsMerged ?? project.clips.length),
    },
    {
      label: "Silêncio removido",
      value: formatDuration(stats?.silenceRemovedMs ?? 0),
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-cream">Exportar & compartilhar</h1>
      <p className="mt-1 text-sm text-muted">
        Simulação de render. Na próxima fase entra o processamento local.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="glass rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {card.label}
            </p>
            <p className="mt-2 font-serif text-2xl text-cream">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="glass mt-6 rounded-3xl p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted">
            {exporting ? "Renderizando vlog..." : stats ? "Pronto para publicar" : "Aguardando export"}
          </span>
          <span className="text-gold">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-cream/10">
          <motion.div
            className="h-full rounded-full bg-rose"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <ShareButton
          icon={Music2}
          label="TikTok"
          onClick={() => void exportTo("tiktok")}
          active={destination === "tiktok"}
        />
        <ShareButton
          icon={Video}
          label="Reels"
          onClick={() => void exportTo("reels")}
          active={destination === "reels"}
        />
        <ShareButton
          icon={Download}
          label="Salvar local"
          onClick={() => void exportTo("local")}
          active={destination === "local"}
        />
      </div>
    </div>
  );
}

function ShareButton({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: typeof Music2;
  label: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-semibold ${
        active ? "bg-cream text-ink" : "glass text-cream"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
