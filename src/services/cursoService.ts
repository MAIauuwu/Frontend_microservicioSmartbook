import api from './api';
import type { Curso } from '../types';

export const cursoService = {
  getAll: async (): Promise<Curso[]> => {
    const response = await api.get('/cursos');
    return response.data;
  },

  getById: async (id: number): Promise<Curso> => {
    const response = await api.get(`/cursos/${id}`);
    return response.data;
  },

  create: async (data: Partial<Curso>): Promise<Curso> => {
    const response = await api.post('/cursos', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Curso>): Promise<Curso> => {
    const response = await api.put(`/cursos/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/cursos/${id}`);
  },
};
