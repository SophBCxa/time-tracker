import api from './api';
import { Activity } from '../domain/Activity';

export const ActivityApi = {
  getByRange: (from: string, to: string): Promise<Activity[]> =>
    api.get<Activity[]>('/activities', { params: { from, to } }).then(r => r.data),

  getByDate: (date: string): Promise<Activity[]> =>
    api.get<Activity[]>('/activities', { params: { from: date, to: date } }).then(r => r.data),

  add: (activity: Activity): Promise<Activity> =>
    api.post<Activity>('/activities', activity).then(r => r.data),

  update: (activity: Activity): Promise<Activity> =>
    api.patch<Activity>(`/activities/${activity.id}`, activity).then(r => r.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/activities/${id}`).then(() => undefined),
};
