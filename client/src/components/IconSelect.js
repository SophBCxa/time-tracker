import React from 'react';
import { Form } from 'react-bootstrap';

function IconSelect({ value, onChange, label = 'Icône (classe Font Awesome)', required = false }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-bold">{label}</Form.Label>
      <Form.Control
        type="text"
        value={value}
        onChange={(e) => onChange(e)}
        placeholder="ex: fas fa-plane"
        required={required}
      />
      <Form.Text className="text-muted">
        Besoin d'inspiration ? Consultez les icônes gratuites :{' '}
        <a
          href="https://fontawesome.com/icons?m=free"
          target="_blank"
          rel="noreferrer"
        >
          Font Awesome Free
        </a>
        .
      </Form.Text>
    </Form.Group>
  );
}

export default IconSelect;
