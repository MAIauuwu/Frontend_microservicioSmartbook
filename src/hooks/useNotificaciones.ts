import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { comunicacionService } from '../services/comunicacionService';
import type { Mensaje } from '../types';

export function useNotificaciones() {
  const { token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);

  const email = useMemo(() => {
    try {
      if (!token) return '';
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || '';
    } catch {
      return '';
    }
  }, [token]);

  useEffect(() => {
    if (!email) return;

    const fetchUnread = async () => {
      try {
        const res = await comunicacionService.getByDestinatario(email);
        const all = res.data;
        setMensajes(all);
        const unread = all.filter(
          (m) => m.estado !== 'LEIDO' && m.estado !== 'ELIMINADO'
        ).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Error al obtener notificaciones:', err);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [email]);

  return { unreadCount, mensajes, email };
}
