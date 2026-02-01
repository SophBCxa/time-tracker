import { useEffect, useState } from 'react';
import {
  getActivityCodes,
  createActivityCode as createActivityCodeApi,
  deleteActivityCode as deleteActivityCodeApi,
  updateActivityCode as updateActivityCodeApi,
} from '../services/api';

export const useActivityCodesData = () => {
  const [activityCodes, setActivityCodes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const clearError = () => setError('');
  const clearSuccess = () => setSuccess('');

  const fetchActivityCodes = async () => {
    try {
      setIsLoading(true);
      const data = await getActivityCodes();
      setActivityCodes(data);
    } catch (err) {
      setError('Erreur lors du chargement des codes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityCodes();
  }, []);

  const createActivityCode = async (payload) => {
    try {
      setIsLoading(true);
      await createActivityCodeApi(payload);
      setSuccess("Code d'activité ajouté !");
      fetchActivityCodes();
      setTimeout(() => setSuccess(''), 3000);
      return true;
    } catch (err) {
      setError("Erreur lors de l'ajout du code");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteActivityCode = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce code d'activité ?")) {
      try {
        setIsLoading(true);
        await deleteActivityCodeApi(id);
        setSuccess("Code d'activité supprimé !");
        fetchActivityCodes();
        setTimeout(() => setSuccess(''), 3000);
        return true;
      } catch (err) {
        setError('Erreur lors de la suppression du code');
        return false;
      } finally {
        setIsLoading(false);
      }
    }
    return false;
  };

  const updateActivityCode = async (id, payload) => {
    try {
      setIsLoading(true);
      await updateActivityCodeApi(id, payload);
      setSuccess("Code d'activité mis à jour !");
      fetchActivityCodes();
      setTimeout(() => setSuccess(''), 3000);
      return true;
    } catch (err) {
      setError('Erreur lors de la mise à jour du code');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activityCodes,
    error,
    success,
    isLoading,
    clearError,
    clearSuccess,
    createActivityCode,
    deleteActivityCode,
    updateActivityCode,
    refreshActivityCodes: fetchActivityCodes,
  };
};
