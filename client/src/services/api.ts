import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Since backend is served from same origin (Vercel), we use relative path
const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token if available
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error: AxiosError) => {
    return Promise.reject(error);
});

// Response interceptor to handle 401 (optional: redirect to login)
api.interceptors.response.use((response: AxiosResponse) => response, (error: AxiosError) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Clear invalid token
        // localStorage.removeItem('adminToken');
        // window.location.href = '/admin/login'; 
        // Note: Direct redirect might be abrupt, better to handle in UI components or Context
    }
    return Promise.reject(error);
});

export const getBooks = (page: number = 1, limit: number = 12, search: string = '') => api.get(`/books?page=${page}&limit=${limit}&search=${search}`);
export const getBook = (id: string) => api.get(`/books/${id}`);
export const loginAdmin = (credentials: any) => api.post('/admin/login', credentials);
export const createBook = (data: any) => api.post('/books', data);
export const updateBook = (id: string, data: any) => api.put(`/books/${id}`, data);
export const deleteBook = (id: string) => api.delete(`/books/${id}`);

export default api;
