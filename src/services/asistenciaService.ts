import api from './api';
import type { Asistencia, AsistenciaRequest, AsistenciaUpdateRequest } from '../types';

export const asistenciaService = {
  getAll: () => api.get<Asistencia[]>('/asistencias'),
  getById: (id: number) => api.get<Asistencia>(`/asistencias/${id}`),
  getByUsuario: (userId: string) => api.get<Asistencia[]>(`/asistencias/usuario/${userId}`),
  getByFecha: (fecha: string) => api.get<Asistencia[]>(`/asistencias/fecha/${fecha}`),
  getByEstado: (estado: string) => api.get<Asistencia[]>(`/asistencias/estado/${estado}`),
  getByUsuarioRango: (userId: string, fechaInicio: string, fechaFin: string) =>
    api.get<Asistencia[]>(`/asistencias/usuario/${userId}/rango`, {
      params: { fechaInicio, fechaFin },
    }),
  create: (data: AsistenciaRequest) => api.post<Asistencia>('/asistencias', data),
  update: (id: number, data: AsistenciaUpdateRequest) => api.put<Asistencia>(`/asistencias/${id}`, data),
  delete: (id: number) => api.delete(`/asistencias/${id}`),
};
