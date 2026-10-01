"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { formatDuration } from "@/lib/format";
import { presetService } from "@/services/presetService";
import { useProjectStore } from "@/store/projectStore";

const SAMPLE_CAPTIONS = [
  "acordei e já liguei a câmera",
  "rotina rápida, sem overthinking",
  "esse take entra no vlog de hoje",
];

export function PreviewPlayer() {
  const clips = useProjectStore((state) => state.project.clips);
  const presetId = useProjectStore((state) => state.project.presetId);
  const autoCaptions = useProjectStore((state) => state.project.ai.autoCaptions);
  const preset = presetService.getById(presetId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [captionIndex, setCaptionIndex] = useState(0);

  const activeClip = clips[0];
  const total = clips.reduce((sum, clip) => sum + clip.durationMs, 0);

  const captionClass = useMemo(() => {
    const pos =
      preset.captionStyle.position === "top"
        ? "top-8"
        : preset.captionStyle.position === "center"
          ? "top-1/2 -translate-y-1/2"
          : "bottom-16";
    const font =
      preset.captionStyle.font === "serif" ? "font-serif" : "font-sans";
    return `absolute left-4 right-4 ${pos} ${font} text-center text-sm md:text-base`;
  }, [preset]);

  return (
    <div className="flex flex-col items-center">
      <div className="phone-frame relative w-full max-w-[280px] overflow-hidden rounded-[2rem] border border-cream/10 bg-ink-soft shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:max-w-[320px]">
        {activeClip?.objectUrl ? (
          <video
            ref={videoRef}
            src={activeClip.objectUrl}
            className="h-full w-full object-cover"
            playsInline
            loop
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={() => {
              if (!videoRef.current) return;
              const t = videoRef.current.currentTime;
              setCaptionIndex(Math.floor(t) % SAMPLE_CAPTIONS.length);
            }}
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(180deg, ${preset.accent}55, #0e0a0c)`,
            }}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" />

        {autoCaptions ? (
          <AnimatePresence mode="wait">
            <motion.p
              key={captionIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={captionClass}
              style={{ color: preset.captionStyle.highlight }}
            >
              {SAMPLE_CAPTIONS[captionIndex]}
            </motion.p>
          </AnimatePresence>
        ) : null}

        <button
          type="button"
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            if (video.paused) void video.play();
            else video.pause();
          }}
          className="absolute bottom-4 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-cream text-ink"
          aria-label={playing ? "Pausar preview" : "Reproduzir preview"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>
      <p className="mt-4 text-xs text-muted">
        Preview 9:16 · {preset.name} · {formatDuration(total)}
      </p>
    </div>
  );
}
