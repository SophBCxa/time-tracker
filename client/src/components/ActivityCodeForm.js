import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import ColorSelect from './ColorSelect';
import IconSelect from './IconSelect';

function ActivityCodeForm({ newCode, setNewCode, errors, isSubmitting, onSubmit }) {
  return (
    <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Ajouter un Nouveau Code</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Label</Form.Label>
              <Form.Control
                type="text"
                value={newCode.label}
                onChange={(e) => setNewCode({ ...newCode, label: e.target.value })}
                placeholder="ex: Développement"
                required
                isInvalid={!!errors?.label}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.label}
              </Form.Control.Feedback>
            </Form.Group>

            <ColorSelect
              value={newCode.color}
              onChange={(e) => setNewCode({ ...newCode, color: e.target.value })}
            />
            {errors?.color && (
              <div className="text-danger small mb-3">{errors.color}</div>
            )}

            <IconSelect
              value={newCode.icon || ''}
              onChange={(e) => setNewCode({ ...newCode, icon: e.target.value })}
            />

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Client</Form.Label>
              <Form.Control
                type="text"
                value={newCode.client}
                onChange={(e) => setNewCode({ ...newCode, client: e.target.value })}
                placeholder="ex: Acme Corp"
                required
                isInvalid={!!errors?.client}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.client}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 fw-bold" disabled={isSubmitting}>
              {isSubmitting ? 'Ajout...' : '➕ Ajouter Code'}
            </Button>
          </Form>
        </Card.Body>
    </Card>
  );
}

export default ActivityCodeForm;
