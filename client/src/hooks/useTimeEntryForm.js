import { useState } from 'react';

const getToday = () => new Date().toISOString().substr(0, 10);

export const useTimeEntryForm = ({ onSubmit }) => {
  const [activityCode, setActivityCode] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [date, setDate] = useState(getToday());
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setActivityCode('');
    setTimeSpent('');
    setDetails('');
    setDate(getToday());
    setErrors({});
  };

  const validate = () => {
    const nextErrors = {};
    if (!date) nextErrors.date = 'La date est obligatoire.';
    if (!activityCode) nextErrors.activityCode = "Le code d'activité est obligatoire.";
    const minutes = Number(timeSpent);
    if (!timeSpent || Number.isNaN(minutes) || minutes <= 0) {
      nextErrors.timeSpent = 'Le temps passé doit être supérieur à 0.';
    }
    if (details && details.length > 500) {
      nextErrors.details = 'Le détail ne doit pas dépasser 500 caractères.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const ok = await onSubmit({ activityCode, timeSpent, date, details });
      if (ok) resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activityCode,
    setActivityCode,
    timeSpent,
    setTimeSpent,
    date,
    setDate,
    details,
    setDetails,
    errors,
    isSubmitting,
    handleSubmit,
    resetForm,
  };
};
