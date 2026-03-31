export interface Project {
  id: string;
  name: string;         // affiché dans le formulaire d'activité
  nisaCode: string;     // exporté comme "Code NISA" dans le CSV
  color: string;        // hex, ex: "#0d6efd"
  allowedTypes: string[]; // sous-ensemble des types globaux
}

export function createProject(data: Omit<Project, 'id'>): Project {
  return {
    ...data,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
}

export const DEFAULT_TYPES = [
  'Correction',
  'Atelier',
  'Livraison',
  'Support',
  'Réunion',
  'Documentation',
  'Recette',
];

export const DEFAULT_PROJECTS: Omit<Project, 'id'>[] = [
  { name: 'PARCEO2025',      nisaCode: '', color: '#0d6efd', allowedTypes: [...DEFAULT_TYPES] },
  { name: 'MAINTENANCE',     nisaCode: '', color: '#198754', allowedTypes: [...DEFAULT_TYPES] },
  { name: 'POLE_DELIVERY',   nisaCode: '', color: '#6610f2', allowedTypes: [...DEFAULT_TYPES] },
  { name: 'ENCADREMENT',     nisaCode: '', color: '#fd7e14', allowedTypes: [...DEFAULT_TYPES] },
  { name: 'RECETTE_INTERNE', nisaCode: '', color: '#0dcaf0', allowedTypes: [...DEFAULT_TYPES] },
];
