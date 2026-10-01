"use client";

import { motion } from "framer-motion";
import { presetService } from "@/services/presetService";
import { useProjectStore } from "@/store/projectStore";

export function PresetSelector() {
  const presetId = useProjectStore((state) => state.project.presetId);
  const setPreset = useProjectStore((state) => state.setPreset);
  const presets = presetService.list();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {presets.map((preset) => {
        const active = preset.id === presetId;
        return (
          <motion.button
            key={preset.id}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => setPreset(preset.id)}
            className={`rounded-2xl p-4 text-left transition ${
              active
                ? "bg-cream text-ink"
                : "glass text-cream hover:border-cream/20"
            }`}
          >
            <span
              className="mb-3 block h-1.5 w-12 rounded-full"
              style={{ background: preset.accent }}
            />
            <p className="font-serif text-lg">{preset.name}</p>
            <p
              className={`mt-1 text-xs ${active ? "text-ink/70" : "text-muted"}`}
            >
              {preset.description}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
