import React from 'react';
import { Form } from 'react-bootstrap';

const COLOR_OPTIONS = [
  { value: 'primary', label: '🔵 Bleu' },
  { value: 'success', label: '🟢 Vert' },
  { value: 'warning', label: '🟡 Jaune' },
  { value: 'danger', label: '🔴 Rouge' },
  { value: 'info', label: '🔷 Cyan' },
  { value: 'dark', label: '⚫ Noir' },
];

function ColorSelect({ value, onChange, label = 'Couleur', required = true }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-bold">{label}</Form.Label>
      <Form.Select
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">-- Choisir une couleur --</option>
        {COLOR_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}

export default ColorSelect;
