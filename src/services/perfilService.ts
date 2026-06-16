import api from './api';
import type { Perfil } from '../types';

export const perfilService = {
  getById: async (id: number): Promise<Perfil> => {
    const response = await api.get(`/perfiles/${id}`);
    return response.data;
  },

  getByUserId: async (userId: number): Promise<Perfil> => {
    const response = await api.get(`/perfiles/user/${userId}`);
    return response.data;
  },

  create: async (data: Partial<Perfil>): Promise<Perfil> => {
    const response = await api.post('/perfiles', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Perfil>): Promise<Perfil> => {
    const response = await api.put(`/perfiles/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/perfiles/${id}`);
  },
};
