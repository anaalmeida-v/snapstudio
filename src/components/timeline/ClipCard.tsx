"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, Trash2 } from "lucide-react";
import { formatDuration, formatFileSize } from "@/lib/format";
import type { Clip } from "@/types";

export function ClipCard({
  clip,
  onRemove,
}: {
  clip: Clip;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: clip.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`glass flex items-center gap-3 rounded-2xl p-3 md:gap-4 md:p-4 ${
        isDragging ? "opacity-70 ring-1 ring-rose" : ""
      }`}
    >
      <button
        type="button"
        className="touch-none rounded-lg p-1 text-muted hover:text-cream"
        aria-label="Reordenar clip"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="relative h-16 w-12 overflow-hidden rounded-xl bg-ink-soft md:h-20 md:w-14">
        {clip.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={clip.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-rose/40 to-gold/20" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-rose/15 px-2 py-0.5 text-[11px] font-semibold text-rose">
            {clip.timestampLabel}
          </span>
          <span className="text-[11px] uppercase tracking-wide text-muted">
            {clip.source}
          </span>
        </div>
        <p className="mt-1 truncate text-sm font-medium text-cream">{clip.name}</p>
        <p className="text-xs text-muted">
          {formatDuration(clip.durationMs)} · {formatFileSize(clip.sizeBytes)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(clip.id)}
        className="rounded-full p-2 text-muted hover:bg-rose/10 hover:text-rose-deep"
        aria-label={`Remover ${clip.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </article>
  );
}
