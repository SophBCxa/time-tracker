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

const iconMap = {
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
};

export const getIcon = (iconName, size = 'sm') => {
  if (!iconName) return null;

  const icon = iconMap[iconName];
  if (icon) {
    return <FontAwesomeIcon icon={icon} size={size} />;
  }

  const sizeMap = {
    xs: '0.75rem',
    sm: '0.875rem',
    lg: '1.25rem',
    '2x': '1.5rem',
    '3x': '2rem',
  };

  return (
    <i
      className={iconName}
      aria-hidden="true"
      style={{ fontSize: sizeMap[size] || '1rem' }}
    />
  );
};

export default getIcon;
