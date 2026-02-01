import { useEffect, useState } from 'react';
import {
  getActivityCodes,
  createActivityCode,
  deleteActivityCode,
} from '../services/api';

export const useActivityCodes = () => {
  const [activityCodes, setActivityCodes] = useState([]);
  const [newCode, setNewCode] = useState({ label: '', color: '', client: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearError = () => setError('');
  const clearSuccess = () => setSuccess('');

  const fetchActivityCodes = async () => {
    try {
      const data = await getActivityCodes();
      setActivityCodes(data);
    } catch (err) {
      setError('Erreur lors du chargement des codes');
    }
  };

  useEffect(() => {
    fetchActivityCodes();
  }, []);

  const handleNewCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      await createActivityCode(newCode);
      setSuccess("Code d'activité ajouté !");
      setNewCode({ label: '', color: '', client: '' });
      fetchActivityCodes();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError("Erreur lors de l'ajout du code");
    }
  };

  const handleDeleteCode = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce code d'activité ?")) {
      try {
        await deleteActivityCode(id);
        setSuccess("Code d'activité supprimé !");
        fetchActivityCodes();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Erreur lors de la suppression du code');
      }
    }
  };

  return {
    activityCodes,
    newCode,
    setNewCode,
    error,
    success,
    clearError,
    clearSuccess,
    handleNewCodeSubmit,
    handleDeleteCode,
    refreshActivityCodes: fetchActivityCodes,
  };
};
