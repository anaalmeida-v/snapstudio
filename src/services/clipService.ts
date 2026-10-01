import { createId, formatTimestamp } from "@/lib/format";
import { detectPlatform } from "@/services/platform";
import type { Clip, MediaSource } from "@/types";

function sourceForPlatform(): MediaSource {
  const platform = detectPlatform();
  if (platform === "mobile") return "gallery";
  if (platform === "desktop") return "desktop";
  return "filesystem";
}

function readVideoMetadata(file: File, objectUrl: string): Promise<{
  durationMs: number;
  thumbnailUrl?: string;
}> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;

    const fallback = () =>
      resolve({
        durationMs: Math.min(180_000, Math.max(4_000, file.size / 40)),
      });

    const timer = window.setTimeout(() => {
      fallback();
    }, 2500);

    video.onloadedmetadata = () => {
      const durationMs = Number.isFinite(video.duration)
        ? video.duration * 1000
        : 8000;
      video.currentTime = Math.min(0.4, video.duration / 4 || 0);
    };

    video.onseeked = () => {
      window.clearTimeout(timer);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 360;
        canvas.height = 640;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ durationMs: video.duration * 1000 });
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve({
          durationMs: video.duration * 1000,
          thumbnailUrl: canvas.toDataURL("image/jpeg", 0.72),
        });
      } catch {
        resolve({ durationMs: video.duration * 1000 });
      }
    };

    video.onerror = () => {
      window.clearTimeout(timer);
      fallback();
    };
  });
}

export const clipService = {
  createDemoClips(): Clip[] {
    const morning = new Date();
    morning.setHours(8, 30, 0, 0);
    const lunch = new Date();
    lunch.setHours(12, 15, 0, 0);
    const night = new Date();
    night.setHours(21, 5, 0, 0);

    const demos = [
      {
        name: "GRWM manhã",
        durationMs: 42_000,
        recordedAt: morning,
        sizeBytes: 8_400_000,
      },
      {
        name: "Almoço no natural",
        durationMs: 28_000,
        recordedAt: lunch,
        sizeBytes: 5_100_000,
      },
      {
        name: "Rotina da noite",
        durationMs: 51_000,
        recordedAt: night,
        sizeBytes: 9_800_000,
      },
    ];

    return demos.map((demo, order) => ({
      id: createId("clip"),
      name: demo.name,
      durationMs: demo.durationMs,
      recordedAt: demo.recordedAt.toISOString(),
      timestampLabel: formatTimestamp(demo.recordedAt),
      objectUrl: "",
      sizeBytes: demo.sizeBytes,
      mimeType: "video/mp4",
      source: sourceForPlatform(),
      order,
    }));
  },

  async createFromFiles(files: FileList | File[]): Promise<Clip[]> {
    const list = Array.from(files).filter((file) =>
      file.type.startsWith("video/"),
    );
    const source = sourceForPlatform();

    const clips = await Promise.all(
      list.map(async (file, index) => {
        const objectUrl = URL.createObjectURL(file);
        const lastModified = file.lastModified
          ? new Date(file.lastModified)
          : new Date();
        const meta = await readVideoMetadata(file, objectUrl);

        return {
          id: createId("clip"),
          name: file.name.replace(/\.[^/.]+$/, ""),
          durationMs: meta.durationMs,
          recordedAt: lastModified.toISOString(),
          timestampLabel: formatTimestamp(lastModified),
          objectUrl,
          thumbnailUrl: meta.thumbnailUrl,
          sizeBytes: file.size,
          mimeType: file.type,
          source,
          order: index,
        } satisfies Clip;
      }),
    );

    return clips.sort(
      (a, b) =>
        new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
    );
  },

  revoke(clip: Clip) {
    if (clip.objectUrl.startsWith("blob:")) {
      URL.revokeObjectURL(clip.objectUrl);
    }
  },

  sortChronologically(clips: Clip[]): Clip[] {
    return [...clips]
      .sort(
        (a, b) =>
          new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
      )
      .map((clip, order) => ({ ...clip, order }));
  },

  reorder(clips: Clip[], activeId: string, overId: string): Clip[] {
    const current = [...clips];
    const from = current.findIndex((clip) => clip.id === activeId);
    const to = current.findIndex((clip) => clip.id === overId);
    if (from < 0 || to < 0) return clips;
    const [moved] = current.splice(from, 1);
    current.splice(to, 0, moved);
    return current.map((clip, order) => ({ ...clip, order }));
  },
};
