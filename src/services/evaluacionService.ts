import api from './api';
import type { Evaluacion } from '../types';

export const evaluacionService = {
  getAll: async (): Promise<Evaluacion[]> => {
    const response = await api.get('/evaluaciones');
    return response.data;
  },

  getById: async (id: number): Promise<Evaluacion> => {
    const response = await api.get(`/evaluaciones/${id}`);
    return response.data;
  },

  create: async (data: Partial<Evaluacion>): Promise<Evaluacion> => {
    const response = await api.post('/evaluaciones', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Evaluacion>): Promise<Evaluacion> => {
    const response = await api.put(`/evaluaciones/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/evaluaciones/${id}`);
  },
};
