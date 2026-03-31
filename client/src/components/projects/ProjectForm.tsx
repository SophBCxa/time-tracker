import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Badge } from 'react-bootstrap';
import { Project } from '../../domain/Project';

type Props = {
  allTypes: string[];
  initial?: Project;
  onSubmit: (data: Omit<Project, 'id'>) => void;
  onCancel?: () => void;
};

const EMPTY = (): Omit<Project, 'id'> => ({
  name: '',
  nisaCode: '',
  color: '#0d6efd',
  allowedTypes: [],
});

export function ProjectForm({ allTypes, initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<Omit<Project, 'id'>>(initial ?? EMPTY());

  useEffect(() => {
    setForm(initial ?? EMPTY());
  }, [initial]);

  const set =
    (field: keyof Omit<Project, 'id' | 'allowedTypes'>) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggleType = (type: string) => {
    setForm((f) => ({
      ...f,
      allowedTypes: f.allowedTypes.includes(type)
        ? f.allowedTypes.filter((t) => t !== type)
        : [...f.allowedTypes, type],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
    if (!initial) setForm(EMPTY());
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3 border rounded bg-body">
      <h6 className="fw-bold mb-3">{initial ? '✏️ Modifier le projet' : '➕ Nouveau projet'}</h6>
      <Row className="g-2 mb-2">
        <Col sm={5}>
          <Form.Label className="small fw-semibold">Nom du projet</Form.Label>
          <Form.Control
            size="sm"
            value={form.name}
            onChange={set('name')}
            placeholder="ex: PARCEO2025"
            required
          />
        </Col>
        <Col sm={4}>
          <Form.Label className="small fw-semibold">Code NISA</Form.Label>
          <Form.Control
            size="sm"
            value={form.nisaCode}
            onChange={set('nisaCode')}
            placeholder="ex: P-2025-001"
          />
        </Col>
        <Col sm={3}>
          <Form.Label className="small fw-semibold">Couleur</Form.Label>
          <div className="d-flex align-items-center gap-2">
            <Form.Control
              type="color"
              value={form.color}
              onChange={set('color')}
              style={{ width: 48, height: 34, padding: 2, cursor: 'pointer' }}
            />
            <code className="small text-muted">{form.color}</code>
          </div>
        </Col>
      </Row>

      <Form.Label className="small fw-semibold">Types d'activité autorisés</Form.Label>
      <div className="d-flex flex-wrap gap-2 mb-3">
        {allTypes.map((t) => (
          <Badge
            key={t}
            bg={form.allowedTypes.includes(t) ? 'primary' : 'light'}
            text={form.allowedTypes.includes(t) ? 'white' : 'dark'}
            className="px-2 py-1"
            style={{ cursor: 'pointer', border: '1px solid #dee2e6', userSelect: 'none' }}
            onClick={() => toggleType(t)}
          >
            {form.allowedTypes.includes(t) ? '✓ ' : ''}{t}
          </Badge>
        ))}
        {allTypes.length === 0 && (
          <span className="text-muted small">Aucun type global défini.</span>
        )}
      </div>

      <div className="d-flex gap-2">
        <Button type="submit" variant="primary" size="sm" disabled={!form.name.trim()}>
          {initial ? '💾 Enregistrer' : '➕ Créer'}
        </Button>
        {onCancel && (
          <Button variant="outline-secondary" size="sm" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </Form>
  );
}
