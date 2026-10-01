"use client";

import { Captions, Scissors, Volume2 } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";

const toggles = [
  {
    key: "autoCutSilence" as const,
    label: "Corte automático de silêncio",
    icon: Scissors,
  },
  {
    key: "voiceVolumeBoost" as const,
    label: "Ajuste de volume da voz",
    icon: Volume2,
  },
  {
    key: "autoCaptions" as const,
    label: "Legendas automáticas",
    icon: Captions,
  },
];

export function AiToggles() {
  const ai = useProjectStore((state) => state.project.ai);
  const setAi = useProjectStore((state) => state.setAi);

  return (
    <div className="mt-5 space-y-3">
      {toggles.map((item) => {
        const on = ai[item.key];
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => setAi({ [item.key]: !on })}
            className="glass flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left"
          >
            <span className="flex items-center gap-3 text-sm text-cream">
              <Icon className="h-4 w-4 text-rose" />
              {item.label}
            </span>
            <span
              className={`relative h-6 w-11 rounded-full transition ${
                on ? "bg-rose" : "bg-cream/15"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-cream transition ${
                  on ? "left-5" : "left-0.5"
                }`}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
