import React from 'react';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faBriefcase,
  faClipboard,
  faBullseye,
  faUsers,
  faLightbulb,
  faBook,
  faEnvelope,
  faBug,
  faCog,
  faChartBar,
  faFolder,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faHeartbeat,
  faRocket,
  faDatabase,
  faPencilAlt,
  faMobileAlt,
} from '@fortawesome/free-solid-svg-icons';

export const ICON_OPTIONS = [
  { value: 'faCode', label: '💻 Développement', icon: faCode },
  { value: 'faBriefcase', label: '💼 Réunion', icon: faBriefcase },
  { value: 'faClipboard', label: '📋 Documentation', icon: faClipboard },
  { value: 'faBullseye', label: '🎯 Objectif', icon: faBullseye },
  { value: 'faUsers', label: '👥 Collaboration', icon: faUsers },
  { value: 'faLightbulb', label: '💡 Idée', icon: faLightbulb },
  { value: 'faBook', label: '📚 Formation', icon: faBook },
  { value: 'faEnvelope', label: '📧 Email', icon: faEnvelope },
  { value: 'faBug', label: '🐛 Débogage', icon: faBug },
  { value: 'faCog', label: '⚙️ Configuration', icon: faCog },
  { value: 'faChartBar', label: '📊 Rapport', icon: faChartBar },
  { value: 'faFolder', label: '📁 Projet', icon: faFolder },
  { value: 'faClock', label: '🕐 Planning', icon: faClock },
  { value: 'faCheckCircle', label: '✅ Validation', icon: faCheckCircle },
  { value: 'faExclamationTriangle', label: '⚠️ Urgence', icon: faExclamationTriangle },
  { value: 'faHeartbeat', label: '💓 Support', icon: faHeartbeat },
  { value: 'faRocket', label: '🚀 Lancement', icon: faRocket },
  { value: 'faDatabase', label: '🗄️ Base de données', icon: faDatabase },
  { value: 'faPencilAlt', label: '✏️ Rédaction', icon: faPencilAlt },
  { value: 'faMobileAlt', label: '📱 Mobile', icon: faMobileAlt },
];

function IconSelect({ value, onChange, label = 'Icône', required = true }) {
  const selectedOption = ICON_OPTIONS.find((opt) => opt.value === value);

  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-bold">{label}</Form.Label>
      <div className="d-flex gap-2 align-items-center">
        <Form.Select
          value={value}
          onChange={(e) => onChange(e)}
          required={required}
        >
          <option value="">-- Choisir une icône --</option>
          {ICON_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
        {selectedOption && (
          <div style={{ fontSize: '1.5rem', color: '#0d6efd', minWidth: '30px' }}>
            <FontAwesomeIcon icon={selectedOption.icon} />
          </div>
        )}
      </div>
    </Form.Group>
  );
}

export default IconSelect;
