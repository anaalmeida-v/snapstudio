"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen, Plus, Smartphone } from "lucide-react";
import { importHint } from "@/services/platform";
import { storageService } from "@/services/storageService";
import { useProjectStore } from "@/store/projectStore";

export function ImportDropzone() {
  const addFiles = useProjectStore((state) => state.addFiles);
  const loadDemoClips = useProjectStore((state) => state.loadDemoClips);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const platform = storageService.getPlatform();

  async function handleFiles(files: FileList | File[] | null) {
    if (!files || (files instanceof FileList && files.length === 0)) return;
    await addFiles(files);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass relative overflow-hidden rounded-3xl p-6 md:p-8 ${
        dragging ? "ring-2 ring-rose" : ""
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        void handleFiles(event.dataTransfer.files);
      }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-rose/20 blur-3xl" />
      <div className="relative flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose/15 text-rose">
          {platform === "mobile" ? (
            <Smartphone className="h-7 w-7" />
          ) : (
            <FolderOpen className="h-7 w-7" />
          )}
        </div>
        <h2 className="font-serif text-2xl text-cream md:text-3xl">
          Importe os takes do dia
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted">
          {importHint(platform)}. Os clips entram na timeline na ordem
          cronológica da gravação.
        </p>
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-rose px-5 py-3 text-sm font-semibold text-ink transition hover:bg-blush"
          >
            <Plus className="h-4 w-4" />
            Adicionar vídeos
          </button>
          <button
            type="button"
            onClick={() => void storageService.pickMediaFiles().then(handleFiles)}
            className="inline-flex items-center justify-center rounded-full border border-cream/15 px-5 py-3 text-sm text-cream hover:bg-cream/5"
          >
            Abrir galeria / arquivos
          </button>
          <button
            type="button"
            onClick={loadDemoClips}
            className="inline-flex items-center justify-center rounded-full border border-gold/30 px-5 py-3 text-sm text-gold hover:bg-gold/10"
          >
            Takes de exemplo
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>
    </motion.div>
  );
}
