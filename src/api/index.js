import axios from 'axios';

const api = axios.create({
    baseURL:  process.env.REACT_APP_SERVER_URL + '/api',
})

export const insertVideo = payload => api.post(`/video`, payload);
export const getAllVideos = () => api.get(`/videos`);
export const updateVideoById = (id, payload) => api.put(`/video/${id}`, payload);
export const deleteVideoById = id => api.delete(`/video/${id}`);
export const getVideoById = id => api.get(`/video/${id}`);

export const insertCategory = payload => api.post(`/category`, payload);
export const getAllCategories = () => api.get(`/categories`);
export const updateCategoryById = (id, payload) => api.put(`/category/${id}`, payload);
export const deleteCategoryById = id => api.delete(`/category/${id}`);
export const getCategoryById = id => api.get(`/category/${id}`);

const apis = {
    insertVideo,
    getAllVideos,
    updateVideoById,
    deleteVideoById,
    getVideoById,
    insertCategory,
    getAllCategories,
    updateCategoryById,
    deleteCategoryById,
    getCategoryById,
}

export default apis;
