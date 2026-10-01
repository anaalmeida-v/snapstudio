"use client";

import Link from "next/link";
import { ExportDashboard } from "@/components/export/ExportDashboard";
import { AppShell } from "@/components/layout/AppShell";
import { PreviewPlayer } from "@/components/player/PreviewPlayer";

export default function ExportPage() {
  return (
    <AppShell step={2}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div>
          <ExportDashboard />
          <div className="mt-6">
            <Link href="/studio" className="text-sm text-muted hover:text-cream">
              ← Ajustar estilo
            </Link>
          </div>
        </div>
        <PreviewPlayer />
      </div>
    </AppShell>
  );
}
