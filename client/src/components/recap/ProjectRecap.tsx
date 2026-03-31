import React, { useState, useMemo } from 'react';
import { Table, Badge } from 'react-bootstrap';
import { Activity } from '../../domain/Activity';
import { Project } from '../../domain/Project';

type Props = {
  projects:   Project[];
  activities: Activity[];
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
}

export function ProjectRecap({ projects, activities }: Props) {
  const [expanded, setExpanded]           = useState<Set<string>>(new Set());
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

  const toggle = (set: Set<string>, key: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(key) ? next.delete(key) : next.add(key);
    setter(next);
  };

  const stats = useMemo(() => {
    const totalTime  = round2(activities.reduce((s, a) => s + a.timeSpent, 0));

    const byProject = activities.reduce<Record<string, number>>((acc, a) => {
      acc[a.project] = round2((acc[a.project] ?? 0) + a.timeSpent);
      return acc;
    }, {});

    const byProjectType = activities.reduce<Record<string, Record<string, Activity[]>>>((acc, a) => {
      acc[a.project] = acc[a.project] ?? {};
      const typeKey = a.type || '— Sans type —';
      acc[a.project][typeKey] = [...(acc[a.project][typeKey] ?? []), a];
      return acc;
    }, {});

    const rows = Object.entries(byProject)
      .sort((a, b) => b[1] - a[1])
      .map(([name, time]) => ({
        name,
        time,
        pct: totalTime > 0 ? Math.round((time / totalTime) * 100) : 0,
        color: projects.find(p => p.name === name)?.color ?? '#6c757d',
        types: Object.entries(byProjectType[name] ?? {})
          .map(([type, acts]) => {
            const typeTime = round2(acts.reduce((s, a) => s + a.timeSpent, 0));
            return {
              type,
              time: typeTime,
              pct: time > 0 ? Math.round((typeTime / time) * 100) : 0,
              activities: [...acts].sort((a, b) => a.date.localeCompare(b.date)),
            };
          })
          .sort((a, b) => b.time - a.time),
      }));

    return { rows, totalTime };
  }, [activities, projects]);

  return (
    <div>
      {stats.rows.length === 0 ? (
        <p className="text-muted fst-italic mt-2">Aucune activité sur cette période.</p>
      ) : (
        <Table hover bordered size="sm" responsive>
          <thead className="table-dark">
            <tr>
              <th style={{ width: 32 }} />
              <th>Projet / Type</th>
              <th style={{ width: 90 }}>Temps</th>
              <th style={{ width: 60 }}>%</th>
              <th>Répartition</th>
            </tr>
          </thead>
          <tbody>
            {stats.rows.map(row => (
              <React.Fragment key={row.name}>
                <tr className="fw-semibold" style={{ cursor: 'pointer' }}
                  onClick={() => toggle(expanded, row.name, setExpanded)}>
                  <td className="text-center text-muted" style={{ fontSize: '0.75rem' }}>
                    {expanded.has(row.name) ? '▼' : '▶'}
                  </td>
                  <td>
                    <span className="d-inline-block me-2"
                      style={{ width: 12, height: 12, borderRadius: 3, background: row.color, verticalAlign: 'middle' }} />
                    {row.name}
                  </td>
                  <td>
                    <Badge bg="" style={{ background: row.color, fontSize: '0.82rem' }}>{row.time} j</Badge>
                  </td>
                  <td className="text-end">{row.pct} %</td>
                  <td>
                    <div className="progress" style={{ height: 10, background: 'var(--bs-border-color)' }}>
                      <div className="progress-bar" style={{ width: `${row.pct}%`, background: row.color }} />
                    </div>
                  </td>
                </tr>

                {expanded.has(row.name) && row.types.map(t => {
                  const typeKey = `${row.name}::${t.type}`;
                  const typeOpen = expandedTypes.has(typeKey);
                  return (
                    <React.Fragment key={typeKey}>
                      <tr className="table-active" style={{ cursor: 'pointer' }}
                        onClick={() => toggle(expandedTypes, typeKey, setExpandedTypes)}>
                        <td className="text-center text-muted" style={{ fontSize: '0.72rem' }}>
                          {typeOpen ? '▼' : '▶'}
                        </td>
                        <td className="text-muted ps-4" style={{ fontSize: '0.88rem' }}>
                          ↳ {t.type}
                        </td>
                        <td className="text-muted" style={{ fontSize: '0.88rem' }}>{t.time} j</td>
                        <td className="text-end text-muted" style={{ fontSize: '0.88rem' }}>{t.pct} %</td>
                        <td>
                          <div className="progress" style={{ height: 6, background: 'var(--bs-border-color)' }}>
                            <div className="progress-bar bg-secondary" style={{ width: `${t.pct}%` }} />
                          </div>
                        </td>
                      </tr>

                      {typeOpen && t.activities.map(a => (
                        <tr key={a.id}>
                          <td />
                          <td className="ps-5" style={{ fontSize: '0.82rem' }}>
                            <span className="text-muted me-2">📅 {formatDate(a.date)}</span>
                            {a.detail
                              ? <span className="fst-italic text-body-secondary">{a.detail}</span>
                              : <span className="text-muted fst-italic">—</span>}
                          </td>
                          <td style={{ fontSize: '0.82rem' }} className="text-muted">{a.timeSpent} j</td>
                          <td /><td />
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}

            <tr className="table-secondary fw-bold">
              <td /><td>Total</td>
              <td>{stats.totalTime} j</td>
              <td className="text-end">100 %</td>
              <td />
            </tr>
          </tbody>
        </Table>
      )}
    </div>
  );
}