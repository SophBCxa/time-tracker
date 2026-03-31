import api from './api';
import { Project } from '../domain/Project';

export const ProjectApi = {
  getAll: (): Promise<Project[]> =>
    api.get<Project[]>('/projects').then(r => r.data),

  add: (p: Project): Promise<Project> =>
    api.post<Project>('/projects', p).then(r => r.data),

  update: (p: Project): Promise<Project> =>
    api.patch<Project>(`/projects/${p.id}`, p).then(r => r.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/projects/${id}`).then(() => undefined),

  getTypes: (): Promise<string[]> =>
    api.get<string[]>('/types').then(r => r.data),

  addType: (type: string): Promise<void> =>
    api.post('/types', { type }).then(() => undefined),

  deleteType: (type: string): Promise<void> =>
    api.delete(`/types/${encodeURIComponent(type)}`).then(() => undefined),
};
