import { useState, useCallback, useEffect } from 'react';
import { Activity, createActivity } from '../domain/Activity';
import { ActivityApi } from '../services/activityApi';

export function useActivities(from: string, to: string) {
  const [activities, setActivities] = useState<Activity[]>([]);

  const refresh = useCallback(async () => {
    const data = await ActivityApi.getByRange(from, to);
    setActivities(data);
  }, [from, to]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (data: Omit<Activity, 'id'>) => {
      await ActivityApi.add(createActivity(data));
      await refresh();
    },
    [refresh]
  );

  const update = useCallback(
    async (activity: Activity) => {
      await ActivityApi.update(activity);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await ActivityApi.delete(id);
      await refresh();
    },
    [refresh]
  );

  const duplicate = useCallback(
    async (a: Activity) => {
      await ActivityApi.add(createActivity({
        date: a.date,
        timeSpent: a.timeSpent,
        project: a.project,
        type: a.type,
        detail: a.detail,
      }));
      await refresh();
    },
    [refresh]
  );

  const totalTime = Math.round(activities.reduce((s, a) => s + Number(a.timeSpent), 0) * 100) / 100;

  return { activities, totalTime, add, update, remove, duplicate };
}

