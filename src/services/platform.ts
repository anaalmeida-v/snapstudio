import type { RuntimePlatform } from "@/types";

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => string;
    };
    __TAURI__?: unknown;
    electron?: unknown;
  }
}

export function detectPlatform(): RuntimePlatform {
  if (typeof window === "undefined") {
    return "web";
  }

  if (window.Capacitor?.isNativePlatform?.()) {
    return "mobile";
  }

  if (window.__TAURI__ || window.electron) {
    return "desktop";
  }

  return "web";
}

export function platformLabel(platform: RuntimePlatform): string {
  switch (platform) {
    case "mobile":
      return "App nativo";
    case "desktop":
      return "Desktop";
    default:
      return "PWA Web";
  }
}

export function importHint(platform: RuntimePlatform): string {
  switch (platform) {
    case "mobile":
      return "Abra a galeria nativa do celular";
    case "desktop":
      return "Abra o explorador de arquivos do computador";
    default:
      return "Arraste arquivos ou escolha na galeria do dispositivo";
  }
}
