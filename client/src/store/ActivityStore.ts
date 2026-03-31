import { Activity } from '../domain/Activity';
import { Project } from '../domain/Project';

const STORAGE_KEY = 'tt_activities';

function load(): Activity[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Activity[];
    // Migre les anciennes entrées qui n'auraient pas timeSpent
    return raw.map((a) => ({ ...a, timeSpent: Number(a.timeSpent) || 0 }));
  } catch {
    return [];
  }
}

function save(list: Activity[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export const ActivityStore = {
  getAll(): Activity[] {
    return load();
  },

  getByDate(date: string): Activity[] {
    return load().filter((a) => a.date === date);
  },

  getByDateRange(from: string, to: string): Activity[] {
    return load()
      .filter((a) => a.date >= from && a.date <= to)
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date)
      );
  },

  add(activity: Activity): void {
    save([...load(), activity]);
  },

  update(activity: Activity): void {
    save(load().map((a) => (a.id === activity.id ? activity : a)));
  },

  delete(id: string): void {
    save(load().filter((a) => a.id !== id));
  },

  /** Génère un CSV avec séparateur ';', prêt à coller dans Excel */
  exportCSV(activities: Activity[], projects: Project[]): string {
    const header = 'Date;TempsPassé;Projet;Code NISA;Type;Détail';
    const rows = activities.map((a) => {
      const project = projects.find((p) => p.name === a.project);
      return [
        a.date,
        a.timeSpent.toString().replace('.', ','),
        a.project,
        project?.nisaCode ?? '',
        a.type,
        `"${a.detail.replace(/"/g, '""')}"`,
      ].join(';');
    });
    return [header, ...rows].join('\n');
  },
};
