import type { Preset } from "@/types";

export const PRESETS: Preset[] = [
  {
    id: "grwm-estetico",
    name: "GRWM Estético",
    description: "Close-ups suaves, paleta blush e cortes no beat da rotina.",
    accent: "#F4A6B0",
    mood: "glowy",
    captionStyle: {
      font: "serif",
      position: "bottom",
      highlight: "#F4A6B0",
    },
  },
  {
    id: "vibe-calma",
    name: "Vibe Calma",
    description: "Transições lentas, tons sage e legendas discretas.",
    accent: "#A8C5B8",
    mood: "calm",
    captionStyle: {
      font: "sans",
      position: "center",
      highlight: "#A8C5B8",
    },
  },
  {
    id: "rotina-focada",
    name: "Rotina Focada",
    description: "Takes objetivos, ritmo constante e texto de checklist.",
    accent: "#E8C39E",
    mood: "focus",
    captionStyle: {
      font: "sans",
      position: "top",
      highlight: "#E8C39E",
    },
  },
  {
    id: "cortes-rapidos",
    name: "Cortes Rápidos",
    description: "Jump cuts agressivos, energia alta e captions pop.",
    accent: "#FF7A8A",
    mood: "fast",
    captionStyle: {
      font: "sans",
      position: "bottom",
      highlight: "#FF7A8A",
    },
  },
];

export const presetService = {
  list(): Preset[] {
    return PRESETS;
  },
  getById(id: string): Preset {
    return PRESETS.find((preset) => preset.id === id) ?? PRESETS[0];
  },
};
