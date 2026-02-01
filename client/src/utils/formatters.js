// Color mapping for Bootstrap classes
export const mapColorToBootstrap = (color) => {
  const colorMap = {
    'bleu': 'primary',
    'blue': 'primary',
    'primary': 'primary',
    'vert': 'success',
    'green': 'success',
    'success': 'success',
    'jaune': 'warning',
    'yellow': 'warning',
    'warning': 'warning',
    'rouge': 'danger',
    'red': 'danger',
    'danger': 'danger',
    'cyan': 'info',
    'info': 'info',
    'noir': 'dark',
    'black': 'dark',
    'dark': 'dark',
  };
  return colorMap[color?.toLowerCase()] || 'secondary';
};

// Format date to French locale
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Convert minutes to human-readable format (e.g., "2h 30m")
export const formatTime = (minutes) => {
  if (!minutes) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};
