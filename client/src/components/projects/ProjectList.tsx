import React, { useState } from 'react';
import { Badge, Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import { Project } from '../../domain/Project';
import { ProjectForm } from './ProjectForm';

type Props = {
  projects: Project[];
  types: string[];
  onUpdate: (project: Project) => void;
  onDelete: (id: string) => void;
  onAddType: (type: string) => void;
  onDeleteType: (type: string) => void;
  onAdd: (data: Omit<Project, 'id'>) => void;
};

export function ProjectList({
  projects,
  types,
  onUpdate,
  onDelete,
  onAddType,
  onDeleteType,
  onAdd,
}: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const [newType, setNewType] = useState('');

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newType.trim();
    if (trimmed && !types.includes(trimmed)) {
      onAddType(trimmed);
      setNewType('');
    }
  };

  return (
    <div>
      {/* ── Types globaux ──────────────────────────────────── */}
      <div className="mb-4 p-3 border rounded bg-body">
        <h6 className="fw-bold mb-2">🏷️ Types d'activité globaux</h6>
        <div className="d-flex flex-wrap gap-2 mb-2">
          {types.map((t) => (
            <Badge
              key={t}
              bg="secondary"
              className="d-flex align-items-center gap-1 px-2 py-1"
              style={{ fontSize: '0.85rem' }}
            >
              {t}
              <span
                style={{ cursor: 'pointer', marginLeft: 4 }}
                onClick={() => onDeleteType(t)}
                title="Supprimer ce type"
              >
                ✕
              </span>
            </Badge>
          ))}
        </div>
        <Form onSubmit={handleAddType}>
          <InputGroup size="sm" style={{ maxWidth: 300 }}>
            <Form.Control
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="Nouveau type…"
            />
            <Button type="submit" variant="outline-primary" disabled={!newType.trim()}>
              Ajouter
            </Button>
          </InputGroup>
        </Form>
      </div>

      {/* ── Liste des projets ──────────────────────────────── */}
      <div className="mb-3">
        <h6 className="fw-bold mb-2">📁 Projets</h6>
        {projects.length === 0 && (
          <p className="text-muted small">Aucun projet. Créez-en un ci-dessous.</p>
        )}
        <ListGroup className="mb-3">
          {projects.map((p) =>
            editId === p.id ? (
              <ListGroup.Item key={p.id} className="p-2">
                <ProjectForm
                  allTypes={types}
                  initial={p}
                  onSubmit={(data) => { onUpdate({ ...p, ...data }); setEditId(null); }}
                  onCancel={() => setEditId(null)}
                />
              </ListGroup.Item>
            ) : (
              <ListGroup.Item
                key={p.id}
                className="d-flex align-items-center justify-content-between py-2"
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      background: p.color,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <span className="fw-semibold">{p.name}</span>
                    {p.nisaCode && (
                      <code className="ms-2 text-muted small">{p.nisaCode}</code>
                    )}
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {p.allowedTypes.map((t) => (
                        <Badge key={t} bg="light" text="dark" className="small">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-nowrap ms-2">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-1 px-1 py-0"
                    onClick={() => setEditId(p.id)}
                  >
                    ✏️
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    className="px-1 py-0"
                    onClick={() => onDelete(p.id)}
                  >
                    🗑
                  </Button>
                </div>
              </ListGroup.Item>
            )
          )}
        </ListGroup>
      </div>

      {/* ── Formulaire de création ─────────────────────────── */}
      {editId === null && (
        <ProjectForm allTypes={types} onSubmit={onAdd} />
      )}
    </div>
  );
}
