import api from './api';
import type { Nota } from '../types';

export const notaService = {
  getAll: async (): Promise<Nota[]> => {
    const response = await api.get('/notas');
    return response.data;
  },

  getById: async (id: number): Promise<Nota> => {
    const response = await api.get(`/notas/${id}`);
    return response.data;
  },

  create: async (data: Partial<Nota>): Promise<Nota> => {
    const response = await api.post('/notas', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Nota>): Promise<Nota> => {
    const response = await api.put(`/notas/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/notas/${id}`);
  },
};
