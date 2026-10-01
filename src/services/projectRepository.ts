import type { ProjectRepository, VlogProject } from "@/types";

const memory = new Map<string, VlogProject>();

/**
 * In-memory repository for the current phase.
 * Swap this class for a Prisma/Drizzle adapter without touching UI code.
 */
export class InMemoryProjectRepository implements ProjectRepository {
  async get(id: string): Promise<VlogProject | null> {
    return memory.get(id) ?? null;
  }

  async save(project: VlogProject): Promise<void> {
    memory.set(project.id, project);
  }

  async list(): Promise<VlogProject[]> {
    return [...memory.values()].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  async clear(): Promise<void> {
    memory.clear();
  }
}

export const projectRepository = new InMemoryProjectRepository();
