import { NextResponse } from "next/server";
import { simulateExportAction } from "@/app/actions";
import type { AiFeatures } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    clipCount: number;
    totalDurationMs: number;
    ai: AiFeatures;
  };

  const stats = await simulateExportAction(body);
  return NextResponse.json(stats);
}
