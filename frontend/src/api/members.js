import api from './client';

export const getMembers = () => api.get('/members').then(res => res.data);
export const getMember = (id) => api.get(`/members/${id}`).then(res => res.data);
export const createMember = (data) => api.post('/members', data).then(res => res.data);
export const deleteMember = (id) => api.delete(`/members/${id}`).then(res => res.data);