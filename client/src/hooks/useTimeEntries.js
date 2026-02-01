import { useEffect, useState } from 'react';
import { getTimeEntries, createTimeEntry, deleteTimeEntry } from '../services/api';

const getToday = () => new Date().toISOString().substr(0, 10);

export const useTimeEntries = () => {
  const [activityCode, setActivityCode] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [date, setDate] = useState(getToday());
  const [details, setDetails] = useState('');
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearError = () => setError('');
  const clearSuccess = () => setSuccess('');

  const fetchEntries = async () => {
    try {
      const data = await getTimeEntries();
      setEntries(data);
    } catch (err) {
      setError('Erreur lors du chargement des entrées');
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTimeEntry({ activityCode, timeSpent, date, details });
      setSuccess('Entrée enregistrée avec succès !');
      setActivityCode('');
      setTimeSpent('');
      setDetails('');
      setDate(getToday());
      fetchEntries();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError("Erreur lors de l'enregistrement");
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée de temps ?')) {
      try {
        await deleteTimeEntry(id);
        setSuccess('Entrée supprimée !');
        fetchEntries();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError("Erreur lors de la suppression de l'entrée");
      }
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
    entries,
    error,
    success,
    clearError,
    clearSuccess,
    handleSubmit,
    handleDeleteEntry,
    refreshEntries: fetchEntries,
  };
};
