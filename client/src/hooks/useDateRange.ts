import { useState } from 'react';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function useDateRange() {
  const [from, setFrom] = useState(todayIso);
  const [to, setTo]     = useState(todayIso);

  const setToday = () => { const t = todayIso(); setFrom(t); setTo(t); };

  const setWeek = () => {
    const d = new Date();
    const day = d.getDay() || 7;
    const mon = new Date(d); mon.setDate(d.getDate() - day + 1);
    const fri = new Date(mon); fri.setDate(mon.getDate() + 4);
    setFrom(mon.toISOString().slice(0, 10));
    setTo(fri.toISOString().slice(0, 10));
  };

  const setMonth = () => {
    const d = new Date();
    setFrom(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
    setTo(new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10));
  };

  return { from, to, setFrom, setTo, setToday, setWeek, setMonth };
}
