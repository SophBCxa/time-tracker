import React, { useState } from 'react';
import { Table, Button, Badge, Alert } from 'react-bootstrap';
import { Activity } from '../../domain/Activity';
import { Project } from '../../domain/Project';
import { ActivityStore } from '../../store/ActivityStore';
import { ActivityForm } from './ActivityForm';
import { DayProgress } from './DayProgress';

type Props = {
  activities: Activity[];
  totalTime: number;
  defaultDate: string;
  projects: Project[];
  onUpdate: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onDuplicate: (activity: Activity) => void;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}


export function ActivityList({
  activities,
  totalTime,
  defaultDate,
  projects,
  onUpdate,
  onDelete,
  onDuplicate,
}: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    const csv = ActivityStore.exportCSV(activities, projects);
    navigator.clipboard.writeText(csv).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Grouper les activités par date
  const grouped = activities.reduce<Record<string, Activity[]>>((acc, a) => {
    (acc[a.date] = acc[a.date] ?? []).push(a);
    return acc;
  }, {});
  const dates = Object.keys(grouped).sort();
  const isMultiDay = dates.length > 1;

  if (activities.length === 0) {
    return (
      <p className="text-muted fst-italic mt-2">
        Aucune activité sur cette période. Utilisez le formulaire ci-dessus pour en ajouter.
      </p>
    );
  }

  const renderRow = (a: Activity) =>
    editId === a.id ? (
      <tr key={a.id}>
        <td colSpan={isMultiDay ? 6 : 5} className="p-2">
          <ActivityForm
            defaultDate={a.date}
            projects={projects}
            initial={a}
            onSubmit={(data) => { onUpdate({ ...a, ...data }); setEditId(null); }}
            onCancel={() => setEditId(null)}
          />
        </td>
      </tr>
    ) : (
      <tr key={a.id}>
        {isMultiDay && <td className="text-muted small">{a.date}</td>}
        <td><Badge bg="info" text="dark">{a.timeSpent}j</Badge></td>
        <td>
          <Badge
            bg=""
            style={{ background: projects.find(p => p.name === a.project)?.color ?? '#6c757d' }}
          >
            {a.project}
          </Badge>
        </td>
        <td>{a.type}</td>
        <td className="text-truncate" style={{ maxWidth: 200 }} title={a.detail}>{a.detail}</td>
        <td className="text-nowrap">
          <Button size="sm" variant="outline-primary" className="me-1 px-1 py-0" title="Modifier" onClick={() => setEditId(a.id)}>✏️</Button>
          <Button size="sm" variant="outline-secondary" className="me-1 px-1 py-0" title="Dupliquer" onClick={() => onDuplicate(a)}>📋</Button>
          <Button size="sm" variant="outline-danger" className="px-1 py-0" title="Supprimer" onClick={() => onDelete(a.id)}>🗑</Button>
        </td>
      </tr>
    );

  return (
    <>
      {copied && (
        <Alert variant="success" className="py-2 mt-2">
          ✅ CSV copié — collez dans Excel (séparateur <code>;</code>).
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
        <span className="fw-bold fs-5">
          Total :<DayProgress total={totalTime} />
          {isMultiDay && <span className="text-muted fs-6 ms-2">sur {dates.length} jours</span>}
        </span>
        <Button variant="outline-success" size="sm" onClick={handleExport}>📋 Copier CSV</Button>
      </div>

      <Table striped hover bordered size="sm" responsive>
        <thead className="table-dark">
          <tr>
            {isMultiDay && <th>Date</th>}
            <th>Temps passé</th><th>Projet</th><th>Type</th><th>Détail</th><th style={{ width: 110 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isMultiDay
            ? dates.map((date) => {
                const dayTotal = Math.round(grouped[date].reduce((s, a) => s + Number(a.timeSpent), 0) * 100) / 100;
                return (
                  <React.Fragment key={date}>
                    <tr className="table-secondary">
                      <td colSpan={6} className="fw-semibold py-1 px-2">
                        📅 {formatDate(date)}<DayProgress total={dayTotal} />
                      </td>
                    </tr>
                    {grouped[date].map(renderRow)}
                  </React.Fragment>
                );
              })
            : activities.map(renderRow)}
        </tbody>
      </Table>
    </>
  );
}

