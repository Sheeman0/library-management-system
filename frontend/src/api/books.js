import api from './client';

export const getBooks = () => api.get('/books').then(res => res.data);
export const getBook = (id) => api.get(`/books/${id}`).then(res => res.data);
export const createBook = (data) => api.post('/books', data).then(res => res.data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data).then(res => res.data);
export const deleteBook = (id) => api.delete(`/books/${id}`).then(res => res.data);