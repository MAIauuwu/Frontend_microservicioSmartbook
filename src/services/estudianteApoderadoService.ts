import api from './api';
import type { EstudianteApoderado, EstudianteApoderadoRequest } from '../types';

export const estudianteApoderadoService = {
  getAll: () => api.get<EstudianteApoderado[]>('/estudiante-apoderado'),
  getById: (id: number) => api.get<EstudianteApoderado>(`/estudiante-apoderado/${id}`),
  getByEstudiante: (estudianteId: number) =>
    api.get<EstudianteApoderado[]>(`/estudiante-apoderado/estudiante/${estudianteId}`),
  getByApoderado: (apoderadoId: number) =>
    api.get<EstudianteApoderado[]>(`/estudiante-apoderado/apoderado/${apoderadoId}`),
  create: (data: EstudianteApoderadoRequest) =>
    api.post<EstudianteApoderado>('/estudiante-apoderado', data),
  update: (id: number, data: Partial<EstudianteApoderadoRequest>) =>
    api.put<EstudianteApoderado>(`/estudiante-apoderado/${id}`, data),
  delete: (id: number) => api.delete(`/estudiante-apoderado/${id}`),
};
