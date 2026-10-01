"use client";

import { useEffect } from "react";
import { Aperture } from "lucide-react";
import { detectPlatform, platformLabel } from "@/services/platform";
import { useProjectStore } from "@/store/projectStore";

const steps = [
  { href: "/", label: "Importar" },
  { href: "/studio", label: "Estilo" },
  { href: "/export", label: "Exportar" },
];

export function AppShell({
  step,
  children,
}: {
  step: 0 | 1 | 2;
  children: React.ReactNode;
}) {
  const hydrate = useProjectStore((state) => state.hydrate);
  const hydrated = useProjectStore((state) => state.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const platform =
    typeof window === "undefined" ? "web" : detectPlatform();

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-10 pt-5 md:px-8 md:pt-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose/20 text-rose">
            <Aperture className="h-5 w-5" />
          </div>
          <div>
            <p className="font-serif text-xl tracking-tight text-cream">
              SnapStudio
            </p>
            <p className="text-xs text-muted">
              Vlogs diários · GRWM · rotina
            </p>
          </div>
        </div>
        <span className="rounded-full border border-cream/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-gold">
          {platformLabel(platform)}
        </span>
      </header>

      <nav className="mb-6 grid grid-cols-3 gap-2 rounded-2xl glass p-1.5">
        {steps.map((item, index) => {
          const active = index === step;
          return (
            <div
              key={item.href}
              className={`rounded-xl px-3 py-2 text-center text-xs font-medium md:text-sm ${
                active
                  ? "bg-cream text-ink"
                  : "text-muted"
              }`}
            >
              <span className="hidden md:inline">{index + 1}. </span>
              {item.label}
            </div>
          );
        })}
      </nav>

      {hydrated ? children : (
        <div className="glass rounded-3xl p-10 text-center text-muted">
          Carregando projeto...
        </div>
      )}
    </div>
  );
}
