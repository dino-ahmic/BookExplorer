import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials) => {
  const response = await api.post('/auth/login/', credentials);
  return response.data;
};

export const getBooks = async () => {
  const response = await api.get('/books/');
  return response.data;
};

export const getBookById = async (id) => {
  const response = await api.get(`/books/${id}/`);
  return response.data;
};

export const getBookNotes = async (bookId) => {
  const response = await api.get(`/books/${bookId}/notes/`);
  return response.data;
};

export const createBookNote = async (bookId, noteData) => {
  const response = await api.post(`/books/${bookId}/notes/create/`, noteData);
  return response.data;
};

export default api;