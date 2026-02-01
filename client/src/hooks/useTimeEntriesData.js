import { useEffect, useState } from 'react';
import {
  getTimeEntries,
  createTimeEntry as createTimeEntryApi,
  deleteTimeEntry as deleteTimeEntryApi,
  updateTimeEntry as updateTimeEntryApi,
} from '../services/api';

export const useTimeEntriesData = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [updatingIds, setUpdatingIds] = useState({});

  const clearError = () => setError('');
  const clearSuccess = () => setSuccess('');

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const data = await getTimeEntries();
      setEntries(data);
    } catch (err) {
      setError('Erreur lors du chargement des entrées');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const createTimeEntry = async (payload) => {
    try {
      setIsLoading(true);
      await createTimeEntryApi(payload);
      setSuccess('Entrée enregistrée avec succès !');
      fetchEntries();
      setTimeout(() => setSuccess(''), 3000);
      return true;
    } catch (err) {
      setError("Erreur lors de l'enregistrement");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTimeEntry = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée de temps ?')) {
      try {
        setIsLoading(true);
        await deleteTimeEntryApi(id);
        setSuccess('Entrée supprimée !');
        fetchEntries();
        setTimeout(() => setSuccess(''), 3000);
        return true;
      } catch (err) {
        setError("Erreur lors de la suppression de l'entrée");
        return false;
      } finally {
        setIsLoading(false);
      }
    }
    return false;
  };

  const updateTimeEntry = async (id, payload) => {
    try {
      setUpdatingIds((prev) => ({ ...prev, [id]: true }));
      setIsLoading(true);
      const updated = await updateTimeEntryApi(id, payload);
      setEntries((prev) => prev.map((entry) => (entry._id === id ? updated : entry)));
      return true;
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'entrée');
      return false;
    } finally {
      setIsLoading(false);
      setUpdatingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  return {
    entries,
    error,
    success,
    isLoading,
    updatingIds,
    clearError,
    clearSuccess,
    createTimeEntry,
    deleteTimeEntry,
    updateTimeEntry,
    refreshEntries: fetchEntries,
  };
};
