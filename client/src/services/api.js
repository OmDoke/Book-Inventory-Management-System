import axios from 'axios';

// Since backend is served from same origin (Vercel), we use relative path
const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle 401 (optional: redirect to login)
api.interceptors.response.use((response) => response, (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Clear invalid token
        // localStorage.removeItem('adminToken');
        // window.location.href = '/admin/login'; 
        // Note: Direct redirect might be abrupt, better to handle in UI components or Context
    }
    return Promise.reject(error);
});

export const getBooks = (page = 1, limit = 16) => api.get(`/books?page=${page}&limit=${limit}`);
export const getBook = (id) => api.get(`/books/${id}`);
export const loginAdmin = (credentials) => api.post('/admin/login', credentials);
export const createBook = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

export default api;
