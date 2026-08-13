import api from './api';

export const getGallery = async (eventId) => {
    const response = await api.get(`/gallery/event/${eventId}`);
    return response.data;
};

export const uploadGallery = async (eventId, formData) => {
    const response = await api.post(`/gallery/event/${eventId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteGalleryImage = async (eventId, imageId) => {
    const response = await api.delete(`/gallery/event/${eventId}/images/${imageId}`);
    return response.data;
};
