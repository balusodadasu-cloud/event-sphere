import api from './api';

export const register = async (eventId, data) => {
    const response = await api.post(`/registrations/event/${eventId}`, data);
    return response.data;
};

export const getMyRegistrations = async () => {
    const response = await api.get('/registrations/me');
    return response.data;
};

export const getEventRegistrations = async (eventId) => {
    const response = await api.get(`/registrations/event/${eventId}`);
    return response.data;
};

export const cancelRegistration = async (id) => {
    const response = await api.put(`/registrations/${id}/cancel`);
    return response.data;
};

export const getRegistration = async (id) => {
    const response = await api.get(`/registrations/${id}`);
    return response.data;
};
