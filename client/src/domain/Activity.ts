export interface Activity {
  id: string;
  date: string;        // YYYY-MM-DD
  timeSpent: number;   // fraction de journée : 0.25 | 0.5 | 0.75 | 1
  project: string;     // nom du projet (référence vers Project.name)
  type: string;        // type d'activité
  detail: string;
}

export function createActivity(data: Omit<Activity, 'id'>): Activity {
  return {
    ...data,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timeSpent: Number(data.timeSpent),
  };
}

// Gardés pour les tests existants
export const TIME_OPTIONS = [0.25, 0.5, 0.75, 1] as const;
export const TIME_LABELS: Record<number, string> = {
  0.25: '0,25 — quart de journée',
  0.5:  '0,5 — demi-journée',
  0.75: '0,75 — trois quarts',
  1:    '1 — journée complète',
};
