import api from './api';

export const getMyCertificates = async () => {
    const response = await api.get('/certificates/me');
    return response.data;
};

export const uploadCertificate = async (data) => {
    const response = await api.post('/certificates', data);
    return response.data;
};

export const deleteCertificate = async (id) => {
    const response = await api.delete(`/certificates/${id}`);
    return response.data;
};
