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


export const sentOtp = (request) =>
    API.post('/api/public/send-otp', request)

export const register = (request) =>
    API.post('/api/public/register', request)

export const login = (data) =>
    API.post('/api/public/login', data)

export const resetPassword = (data) =>
    API.post('/api/public/reset-password', data);

export const totalNumberOfUser = () => API.get('/api/public/total-user')

export const totalNumberOfBlogs = () => API.get('/api/public/total-blogs')
