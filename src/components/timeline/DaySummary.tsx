"use client";

import { Clock, Layers } from "lucide-react";
import { formatDuration } from "@/lib/format";
import { useProjectStore } from "@/store/projectStore";

export function DaySummary() {
  const clips = useProjectStore((state) => state.project.clips);
  const total = clips.reduce((sum, clip) => sum + clip.durationMs, 0);
  const first = clips[0]?.timestampLabel ?? "--:--";
  const last = clips[clips.length - 1]?.timestampLabel ?? "--:--";

  return (
    <aside className="glass hidden h-fit rounded-3xl p-6 lg:block">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">Hoje</p>
      <h3 className="mt-2 font-serif text-2xl text-cream">Resumo da rotina</h3>
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3 rounded-2xl bg-cream/5 p-4">
          <Layers className="h-5 w-5 text-rose" />
          <div>
            <p className="text-sm text-cream">{clips.length} vídeos unidos</p>
            <p className="text-xs text-muted">Prontos para o corte automático</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-cream/5 p-4">
          <Clock className="h-5 w-5 text-gold" />
          <div>
            <p className="text-sm text-cream">{formatDuration(total)} brutos</p>
            <p className="text-xs text-muted">
              {first} → {last}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl">
        <div className="phone-frame w-full bg-gradient-to-b from-rose/30 via-ink-soft to-gold/20" />
      </div>
    </aside>
  );
}
