import { useState } from 'react';
import { Activity } from '../domain/Activity';

type NewActivity = Omit<Activity, 'id'>;

export function useOverflowWarning(activities: Activity[], onAdd: (data: NewActivity) => void) {
  const [pending, setPending] = useState<NewActivity | null>(null);

  const handleAdd = (data: NewActivity) => {
    const dayTotal = activities
      .filter(a => a.date === data.date)
      .reduce((sum, a) => sum + a.timeSpent, 0);
    if (dayTotal + data.timeSpent > 1) {
      setPending(data);
    } else {
      onAdd(data);
    }
  };

  const confirm = () => { if (pending) { onAdd(pending); setPending(null); } };
  const cancel  = () => setPending(null);

  return { pending, handleAdd, confirm, cancel };
}
