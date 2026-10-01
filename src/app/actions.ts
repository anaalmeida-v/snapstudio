"use server";

import { presetService } from "@/services/presetService";
import type { AiFeatures, ExportStats } from "@/types";

export async function getPresetsAction() {
  return presetService.list();
}

export async function simulateExportAction(input: {
  clipCount: number;
  totalDurationMs: number;
  ai: AiFeatures;
}): Promise<ExportStats> {
  const silenceRemovedMs = input.ai.autoCutSilence
    ? Math.round(input.totalDurationMs * 0.18)
    : 0;

  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    totalDurationMs: Math.max(0, input.totalDurationMs - silenceRemovedMs),
    clipsMerged: input.clipCount,
    silenceRemovedMs,
  };
}
