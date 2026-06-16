import api from './api';
import type { Estudiante } from '../types';

export const estudianteService = {
  getAll: async (): Promise<Estudiante[]> => {
    const response = await api.get('/estudiantes');
    return response.data;
  },

  getById: async (id: number): Promise<Estudiante> => {
    const response = await api.get(`/estudiantes/${id}`);
    return response.data;
  },

  create: async (data: Partial<Estudiante>): Promise<Estudiante> => {
    const response = await api.post('/estudiantes', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Estudiante>): Promise<Estudiante> => {
    const response = await api.put(`/estudiantes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/estudiantes/${id}`);
  },
};
