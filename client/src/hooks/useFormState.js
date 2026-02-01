import { useState } from 'react';

// Custom hook for managing form state with a single object
export const useFormState = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const reset = () => {
    setFormData(initialState);
  };

  return [formData, updateField, reset];
};
