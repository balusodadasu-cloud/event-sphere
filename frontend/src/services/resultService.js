import api from './api';

export const getResults = async (eventId) => {
    const response = await api.get(`/results/event/${eventId}`);
    return response.data;
};

export const publishResults = async (data) => {
    const response = await api.post('/results', data);
    return response.data;
};

export const deleteResults = async (eventId) => {
    const response = await api.delete(`/results/event/${eventId}`);
    return response.data;
};
