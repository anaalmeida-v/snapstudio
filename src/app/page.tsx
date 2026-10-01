"use client";

import Link from "next/link";
import { ImportDropzone } from "@/components/import/ImportDropzone";
import { AppShell } from "@/components/layout/AppShell";
import { ClipTimeline } from "@/components/timeline/ClipTimeline";
import { DaySummary } from "@/components/timeline/DaySummary";
import { useProjectStore } from "@/store/projectStore";

export default function ImportPage() {
  const clipCount = useProjectStore((state) => state.project.clips.length);

  return (
    <AppShell step={0}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <ImportDropzone />
          <ClipTimeline />
          <div className="mt-6 flex justify-end">
            <Link
              href="/studio"
              className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                clipCount === 0
                  ? "pointer-events-none bg-cream/10 text-muted"
                  : "bg-cream text-ink hover:bg-blush"
              }`}
            >
              Continuar para estilo
            </Link>
          </div>
        </div>
        <DaySummary />
      </div>
    </AppShell>
  );
}
