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
  const icon = iconMap[iconName];
  if (!icon) return null;
  return <FontAwesomeIcon icon={icon} size={size} />;
};

export default getIcon;
