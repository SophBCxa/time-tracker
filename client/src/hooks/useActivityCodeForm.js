import { useState } from 'react';

export const useActivityCodeForm = ({ onSubmit }) => {
  const [newCode, setNewCode] = useState({ label: '', color: '', client: '', icon: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setNewCode({ label: '', color: '', client: '', icon: '' });
    setErrors({});
  };

  const validate = () => {
    const nextErrors = {};
    if (!newCode.label?.trim()) nextErrors.label = 'Le label est obligatoire.';
    if (!newCode.color) nextErrors.color = 'La couleur est obligatoire.';
    if (!newCode.client?.trim()) nextErrors.client = 'Le client est obligatoire.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const ok = await onSubmit(newCode);
      if (ok) resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    newCode,
    setNewCode,
    errors,
    isSubmitting,
    handleSubmit,
    resetForm,
  };
};
