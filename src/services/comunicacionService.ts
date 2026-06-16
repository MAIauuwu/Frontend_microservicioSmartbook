import api from './api';
import type { Mensaje, MensajeRequest } from '../types';

export const comunicacionService = {
  getAll: () => api.get<Mensaje[]>('/mensajes'),
  getById: (id: number) => api.get<Mensaje>(`/mensajes/${id}`),
  getByRemitente: (email: string) => api.get<Mensaje[]>(`/mensajes/remitente/${email}`),
  getByDestinatario: (email: string) => api.get<Mensaje[]>(`/mensajes/destinatario/${email}`),
  create: (data: MensajeRequest) => api.post<Mensaje>('/mensajes', data),
  marcarLeido: (id: number) => api.patch<Mensaje>(`/mensajes/${id}/leido`),
  delete: (id: number) => api.delete(`/mensajes/${id}`),
};
