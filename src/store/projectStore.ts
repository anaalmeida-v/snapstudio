"use client";

import { create } from "zustand";
import { clipService } from "@/services/clipService";
import { projectRepository } from "@/services/projectRepository";
import { storageService } from "@/services/storageService";
import { createId } from "@/lib/format";
import type { AiFeatures, VlogProject } from "@/types";

const defaultAi: AiFeatures = {
  autoCutSilence: true,
  voiceVolumeBoost: true,
  autoCaptions: true,
};

function emptyProject(): VlogProject {
  const now = new Date().toISOString();
  return {
    id: createId("project"),
    title: "Vlog de hoje",
    clips: [],
    presetId: "grwm-estetico",
    ai: defaultAi,
    createdAt: now,
    updatedAt: now,
  };
}

interface ProjectState {
  project: VlogProject;
  hydrated: boolean;
  hydrate: () => void;
  addFiles: (files: FileList | File[]) => Promise<void>;
  loadDemoClips: () => void;
  reorderClips: (activeId: string, overId: string) => void;
  removeClip: (id: string) => void;
  setPreset: (presetId: string) => void;
  setAi: (patch: Partial<AiFeatures>) => void;
  setTitle: (title: string) => void;
  reset: () => void;
}

function persist(project: VlogProject) {
  const next = { ...project, updatedAt: new Date().toISOString() };
  storageService.saveProject(next);
  void projectRepository.save(next);
  return next;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: emptyProject(),
  hydrated: false,
  hydrate: () => {
    const stored = storageService.loadProject();
    set({
      project: stored ?? emptyProject(),
      hydrated: true,
    });
  },
  addFiles: async (files) => {
    const created = await clipService.createFromFiles(files);
    const merged = clipService.sortChronologically([
      ...get().project.clips,
      ...created.map((clip, index) => ({
        ...clip,
        order: get().project.clips.length + index,
      })),
    ]);
    set((state) => ({
      project: persist({ ...state.project, clips: merged }),
    }));
  },
  loadDemoClips: () => {
    set((state) => ({
      project: persist({
        ...state.project,
        clips: clipService.sortChronologically([
          ...state.project.clips,
          ...clipService.createDemoClips(),
        ]),
      }),
    }));
  },
  reorderClips: (activeId, overId) => {
    set((state) => ({
      project: persist({
        ...state.project,
        clips: clipService.reorder(state.project.clips, activeId, overId),
      }),
    }));
  },
  removeClip: (id) => {
    const clip = get().project.clips.find((item) => item.id === id);
    if (clip) clipService.revoke(clip);
    set((state) => ({
      project: persist({
        ...state.project,
        clips: state.project.clips
          .filter((item) => item.id !== id)
          .map((item, order) => ({ ...item, order })),
      }),
    }));
  },
  setPreset: (presetId) => {
    set((state) => ({
      project: persist({ ...state.project, presetId }),
    }));
  },
  setAi: (patch) => {
    set((state) => ({
      project: persist({ ...state.project, ai: { ...state.project.ai, ...patch } }),
    }));
  },
  setTitle: (title) => {
    set((state) => ({
      project: persist({ ...state.project, title }),
    }));
  },
  reset: () => {
    get().project.clips.forEach(clipService.revoke);
    storageService.clearProject();
    set({ project: emptyProject() });
  },
}));
