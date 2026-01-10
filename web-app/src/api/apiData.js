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

export const getUserById = (id) => API.get(`/data/get-by/${id}`)
export const apiGetAllUsers = () => API.get('/data/get-all/users')
export const apiGetAllBlogs = () => API.get('/data/getAll/blogs')

