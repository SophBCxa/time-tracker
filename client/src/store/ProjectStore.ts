import { Project, createProject, DEFAULT_TYPES, DEFAULT_PROJECTS } from '../domain/Project';

const PROJECTS_KEY = 'tt_projects';
const TYPES_KEY = 'tt_activity_types';

function loadProjects(): Project[] {
  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    if (stored) return JSON.parse(stored) as Project[];
    const seeded = DEFAULT_PROJECTS.map((p) => createProject(p));
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(seeded));
    return seeded;
  } catch {
    return [];
  }
}

function saveProjects(list: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
}

function loadTypes(): string[] {
  try {
    const stored = localStorage.getItem(TYPES_KEY);
    if (stored) return JSON.parse(stored) as string[];
    localStorage.setItem(TYPES_KEY, JSON.stringify(DEFAULT_TYPES));
    return [...DEFAULT_TYPES];
  } catch {
    return [...DEFAULT_TYPES];
  }
}

function saveTypes(list: string[]): void {
  localStorage.setItem(TYPES_KEY, JSON.stringify(list));
}

export const ProjectStore = {
  // ── Projets ──────────────────────────────────────────────
  getAll(): Project[] {
    return loadProjects();
  },

  add(project: Project): void {
    saveProjects([...loadProjects(), project]);
  },

  update(project: Project): void {
    saveProjects(loadProjects().map((p) => (p.id === project.id ? project : p)));
  },

  delete(id: string): void {
    saveProjects(loadProjects().filter((p) => p.id !== id));
  },

  // ── Types globaux ────────────────────────────────────────
  getTypes(): string[] {
    return loadTypes();
  },

  addType(type: string): void {
    const types = loadTypes();
    if (!types.includes(type)) saveTypes([...types, type]);
  },

  deleteType(type: string): void {
    saveTypes(loadTypes().filter((t) => t !== type));
  },
};
