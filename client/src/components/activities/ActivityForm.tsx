import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Activity, TIME_OPTIONS, TIME_LABELS } from '../../domain/Activity';
import { Project } from '../../domain/Project';

type Props = {
  defaultDate: string;
  projects: Project[];
  initial?: Activity;
  onSubmit: (data: Omit<Activity, 'id'>) => void;
  onCancel?: () => void;
};

type FormState = {
  date: string;
  timeSpent: number;
  project: string;
  type: string;
  detail: string;
};

const EMPTY = (date: string, firstProject = ''): FormState => ({
  date,
  timeSpent: 0.5,
  project: firstProject,
  type: '',
  detail: '',
});

export function ActivityForm({ defaultDate, projects, initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(
    initial
      ? { date: initial.date, timeSpent: initial.timeSpent, project: initial.project, type: initial.type, detail: initial.detail }
      : EMPTY(defaultDate, projects[0]?.name ?? '')
  );

  // Quand la liste de projets charge, initialiser le projet par defaut
  useEffect(() => {
    if (!initial && !form.project && projects.length > 0) {
      setForm((f) => ({ ...f, project: projects[0].name }));
    }
  }, [projects, initial, form.project]);

  // Types disponibles selon le projet selectionne
  const selectedProject = projects.find((p) => p.name === form.project);
  const availableTypes = useMemo(
    () => selectedProject?.allowedTypes ?? [],
    [selectedProject]
  );

  // Si le type courant n'est plus disponible dans le nouveau projet, le réinitialiser
  useEffect(() => {
    if (form.type && availableTypes.length > 0 && !availableTypes.includes(form.type)) {
      setForm((f) => ({ ...f, type: '' }));
    }
  }, [form.project, availableTypes, form.type]);

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const projectColor = selectedProject?.color ?? '#6c757d';

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    onSubmit({
      date: form.date,
      timeSpent: Number(form.timeSpent),
      project: form.project,
      type: form.type,
      detail: form.detail,
    });
    if (!initial) setForm(EMPTY(defaultDate, projects[0]?.name ?? ''));
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3 p-3 border rounded bg-body">
      {/* Ligne 1 : champs principaux — chacun prend 1/4 de la largeur */}
      <Row className="g-2 align-items-end mb-2">
        <Col xs={12} sm={2}>
          <Form.Label className="mb-1 small fw-semibold">Date</Form.Label>
          <Form.Control type="date" value={form.date} onChange={set('date')} required size="sm" />
        </Col>
        <Col xs={12} sm={3}>
          <Form.Label className="mb-1 small fw-semibold">Temps passé</Form.Label>
          <Form.Select value={form.timeSpent} onChange={set('timeSpent')} size="sm">
            {TIME_OPTIONS.map((v) => (
              <option key={v} value={v}>{TIME_LABELS[v]}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} sm={4}>
          <Form.Label className="mb-1 small fw-semibold">Projet</Form.Label>
          <div className="d-flex align-items-center gap-1">
            <div style={{ width: 14, height: 14, borderRadius: 3, background: projectColor, flexShrink: 0 }} />
            <Form.Select value={form.project} onChange={set('project')} size="sm" className="flex-grow-1">
              {projects.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </Form.Select>
          </div>
        </Col>
        <Col xs={12} sm={3}>
          <Form.Label className="mb-1 small fw-semibold">Type</Form.Label>
          <Form.Select value={form.type} onChange={set('type')} size="sm" disabled={availableTypes.length === 0}>
            <option value="">— Aucun —</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Ligne 2 : détail (toute la place) + bouton en fin de ligne */}
      <Row className="g-2 align-items-end">
        <Col>
          <Form.Label className="mb-1 small fw-semibold">Détail</Form.Label>
          <Form.Control
            value={form.detail}
            onChange={set('detail')}
            placeholder="N° tickets, environnement, remarques..."
            size="sm"
          />
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button type="submit" variant="primary" size="sm" disabled={!form.project}>
            {initial ? 'Enregistrer' : 'Ajouter'}
          </Button>
          {onCancel && (
            <Button variant="outline-secondary" size="sm" onClick={onCancel}>Annuler</Button>
          )}
        </Col>
      </Row>
    </Form>
  );
}
