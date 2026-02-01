// Color mapping for Bootstrap classes
export const mapColorToBootstrap = (color) => {
  const colorMap = {
    'bleu': 'primary',
    'vert': 'success',
    'jaune': 'warning',
    'rouge': 'danger',
    'cyan': 'info',
    'noir': 'dark',
  };
  return colorMap[color?.toLowerCase()] || 'secondary';
};

// Format date to French locale
export const formatDate = (dateString) => {
  console.log('Formatting date:', dateString);
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Format days value with French locale
export const formatTime = (daysValue) => {
  const value = Number(daysValue);
  if (!value || Number.isNaN(value)) return '0 j';
  const formatted = value.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${formatted} j`;
};

// Numeric days value (for exports)
export const formatTimeDaysValue = (daysValue) => {
  const value = Number(daysValue);
  if (!value || Number.isNaN(value)) return 0;
  return Math.round(value * 100) / 100;
};
