export type RuntimePlatform = "web" | "mobile" | "desktop";

export type MediaSource = "gallery" | "filesystem" | "desktop";

export interface Clip {
  id: string;
  name: string;
  durationMs: number;
  recordedAt: string;
  timestampLabel: string;
  objectUrl: string;
  thumbnailUrl?: string;
  sizeBytes: number;
  mimeType: string;
  source: MediaSource;
  order: number;
}

export interface CaptionStyle {
  font: string;
  position: "top" | "center" | "bottom";
  highlight: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  accent: string;
  mood: string;
  captionStyle: CaptionStyle;
}

export interface AiFeatures {
  autoCutSilence: boolean;
  voiceVolumeBoost: boolean;
  autoCaptions: boolean;
}

export type ExportDestination = "tiktok" | "reels" | "local";

export interface ExportOptions {
  destination: ExportDestination;
  quality: "1080p" | "720p";
}

export interface ExportStats {
  totalDurationMs: number;
  clipsMerged: number;
  silenceRemovedMs: number;
}

export interface VlogProject {
  id: string;
  title: string;
  clips: Clip[];
  presetId: string;
  ai: AiFeatures;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRepository {
  get(id: string): Promise<VlogProject | null>;
  save(project: VlogProject): Promise<void>;
  list(): Promise<VlogProject[]>;
  clear(): Promise<void>;
}
