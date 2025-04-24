import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login/', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register/', userData);
  return response.data;
};

export const getBooks = async (params) => {
  const response = await api.get('/books/', { params });
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

export const updateBookNote = async (noteId, noteData) => {
  const response = await api.put(`/notes/${noteId}/update/`, noteData);
  return response.data;
};

export const deleteBookNote = async (noteId) => {
  const response = await api.delete(`/notes/${noteId}/delete/`);
  return response.data;
};

export const rateBook = async (bookId, rating) => {
  const response = await api.post(`/books/${bookId}/rate/`, { rating });
  return response.data;
};

export const getReadingList = async () => {
  const response = await api.get('/reading-list/');
  return response.data;
};

export const addToReadingList = async (bookId) => {
  const response = await api.post(`/reading-list/add/${bookId}/`);
  return response.data;
};

export const removeFromReadingList = async (bookId) => {
  const response = await api.delete(`/reading-list/remove/${bookId}/`);
  return response.data;
}
export default api;