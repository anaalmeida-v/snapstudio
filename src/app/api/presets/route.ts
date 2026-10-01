import { NextResponse } from "next/server";
import { presetService } from "@/services/presetService";

export async function GET() {
  return NextResponse.json({
    presets: presetService.list(),
  });
}
