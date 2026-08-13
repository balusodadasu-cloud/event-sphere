import api from './api';

export const getClubs = async () => {
    const response = await api.get('/clubs');
    return response.data;
};

export const getClub = async (id) => {
    const response = await api.get(`/clubs/${id}`);
    return response.data;
};

export const createClub = async (data) => {
    const response = await api.post('/clubs', data);
    return response.data;
};

export const updateClub = async (id, data) => {
    const response = await api.put(`/clubs/${id}`, data);
    return response.data;
};

export const deleteClub = async (id) => {
    const response = await api.delete(`/clubs/${id}`);
    return response.data;
};
