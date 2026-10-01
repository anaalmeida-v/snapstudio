import { detectPlatform } from "@/services/platform";
import type { RuntimePlatform, VlogProject } from "@/types";

const PROJECT_KEY = "snapstudio.currentProject";

/**
 * Cross-platform file access abstraction.
 * Web: FilePicker / drag-and-drop
 * Mobile (Capacitor): native gallery via Camera/Filesystem plugins
 * Desktop (Tauri/Electron): native OS file dialog
 */
export const storageService = {
  getPlatform(): RuntimePlatform {
    return detectPlatform();
  },

  async pickMediaFiles(): Promise<File[]> {
    const platform = detectPlatform();

    if (platform === "mobile" && window.Capacitor?.isNativePlatform?.()) {
      // Capacitor Camera / Filesystem plugins plug in here in the native phase.
      return openFilePicker({ multiple: true, accept: "video/*" });
    }

    if (platform === "desktop" && (window.__TAURI__ || window.electron)) {
      // Tauri dialog / Electron dialog plug in here in the desktop phase.
      return openFilePicker({ multiple: true, accept: "video/*" });
    }

    return openFilePicker({ multiple: true, accept: "video/*" });
  },

  saveProject(project: VlogProject) {
    if (typeof window === "undefined") return;
    const serializable: VlogProject = {
      ...project,
      clips: project.clips.map((clip) => ({
        ...clip,
        objectUrl: clip.objectUrl.startsWith("blob:") ? "" : clip.objectUrl,
        thumbnailUrl: clip.thumbnailUrl?.startsWith("data:")
          ? clip.thumbnailUrl
          : undefined,
      })),
    };
    sessionStorage.setItem(PROJECT_KEY, JSON.stringify(serializable));
  },

  loadProject(): VlogProject | null {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(PROJECT_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as VlogProject;
    } catch {
      return null;
    }
  },

  clearProject() {
    sessionStorage.removeItem(PROJECT_KEY);
  },
};

function openFilePicker(options: {
  multiple: boolean;
  accept: string;
}): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = options.accept;
    input.multiple = options.multiple;
    input.onchange = () => {
      resolve(Array.from(input.files ?? []));
    };
    input.click();
  });
}
