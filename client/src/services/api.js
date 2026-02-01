import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getActivityCodes = async () => {
  const response = await api.get('/activity-codes');
  return response.data;
};

export const createActivityCode = async (payload) => {
  const response = await api.post('/activity-codes', payload);
  return response.data;
};

export const deleteActivityCode = async (id) => {
  const response = await api.delete(`/activity-codes/${id}`);
  return response.data;
};

export const updateActivityCode = async (id, payload) => {
  const response = await api.patch(`/activity-codes/${id}`, payload);
  return response.data;
};

export const getTimeEntries = async () => {
  const response = await api.get('/time-entries');
  return response.data;
};

export const createTimeEntry = async (payload) => {
  const response = await api.post('/time-entries', payload);
  return response.data;
};

export const deleteTimeEntry = async (id) => {
  const response = await api.delete(`/time-entries/${id}`);
  return response.data;
};

export const updateTimeEntry = async (id, payload) => {
  const response = await api.patch(`/time-entries/${id}`, payload);
  return response.data;
};
