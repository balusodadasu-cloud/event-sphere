import api from './api';

export const addBookmark = async (eventId) => {
    const response = await api.post(`/bookmarks/event/${eventId}`);
    return response.data;
};

export const removeBookmark = async (eventId) => {
    const response = await api.delete(`/bookmarks/event/${eventId}`);
    return response.data;
};

export const getBookmarks = async () => {
    const response = await api.get('/bookmarks');
    return response.data;
};
