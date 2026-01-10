import axios from "axios";
import { BASE_API } from "./baseapi";

const API = axios.create({
    baseURL: `${BASE_API}/app`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.request.use(config => {
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const getUserDetails = () => API.get('/api/user');
export const userLogout = () => API.post('/api/user/log-out')

export const uploadProfileImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
        const response = await API.post('/api/user/upload-profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading profile image:', error);
        throw error;
    }
};

export const deleteUserAccount = () => API.delete("/api/user/delete-account")
