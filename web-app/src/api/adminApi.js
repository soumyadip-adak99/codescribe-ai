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

export const getAllUsers = () => API.get('/admin/users');
export const getAllBlogs = () => API.get('/admin/blogs');
export const deleteUser = (id) => API.delete(`/admin/users/${id}`)

export const deleteBlog = (id) => API.delete(`/admin/blogs/${id}`)