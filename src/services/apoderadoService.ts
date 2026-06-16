import api from './api';
import type { Apoderado } from '../types';

export const apoderadoService = {
  getAll: async (): Promise<Apoderado[]> => {
    const response = await api.get('/apoderados');
    return response.data;
  },

  getById: async (id: number): Promise<Apoderado> => {
    const response = await api.get(`/apoderados/${id}`);
    return response.data;
  },

  create: async (data: Partial<Apoderado>): Promise<Apoderado> => {
    const response = await api.post('/apoderados', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Apoderado>): Promise<Apoderado> => {
    const response = await api.put(`/apoderados/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/apoderados/${id}`);
  },
};
