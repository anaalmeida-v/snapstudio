"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ClipCard } from "@/components/timeline/ClipCard";
import { formatDuration } from "@/lib/format";
import { useProjectStore } from "@/store/projectStore";

export function ClipTimeline() {
  const clips = useProjectStore((state) => state.project.clips);
  const reorderClips = useProjectStore((state) => state.reorderClips);
  const removeClip = useProjectStore((state) => state.removeClip);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function onDragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return;
    reorderClips(String(event.active.id), String(event.over.id));
  }

  const total = clips.reduce((sum, clip) => sum + clip.durationMs, 0);

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h3 className="font-serif text-xl text-cream">Timeline do dia</h3>
          <p className="text-xs text-muted">
            Arraste para reordenar · ordem inicial cronológica
          </p>
        </div>
        <p className="text-sm text-gold">
          {clips.length} takes · {formatDuration(total)}
        </p>
      </div>

      {clips.length === 0 ? (
        <div className="glass rounded-3xl px-6 py-10 text-center text-sm text-muted">
          Nenhum clip ainda. Importe os vídeos da manhã, do almoço e da noite
          para montar o vlog.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={clips.map((clip) => clip.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-3">
              {clips.map((clip) => (
                <ClipCard key={clip.id} clip={clip} onRemove={removeClip} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}
