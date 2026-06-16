import api from './api';
import type { Docente } from '../types';

export const docenteService = {
  getAll: async (): Promise<Docente[]> => {
    const response = await api.get('/docentes');
    return response.data;
  },

  getById: async (id: number): Promise<Docente> => {
    const response = await api.get(`/docentes/${id}`);
    return response.data;
  },

  create: async (data: Partial<Docente>): Promise<Docente> => {
    const response = await api.post('/docentes', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Docente>): Promise<Docente> => {
    const response = await api.put(`/docentes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/docentes/${id}`);
  },
};
