import api from './client';

export const getBorrowRecords = () => api.get('/borrow').then(res => res.data);
export const getOverdueRecords = () => api.get('/borrow/overdue').then(res => res.data);
export const getMemberHistory = (memberId) => api.get(`/borrow/member/${memberId}`).then(res => res.data);
export const borrowBook = (data) => api.post('/borrow', data).then(res => res.data);
export const returnBook = (id) => api.put(`/borrow/${id}/return`).then(res => res.data);