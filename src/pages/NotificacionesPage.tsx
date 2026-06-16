import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, MailOpen } from 'lucide-react';
import { comunicacionService } from '../services/comunicacionService';
import { useAuth } from '../context/AuthContext';
import type { Mensaje } from '../types';

export default function NotificacionesPage() {
  const { token } = useAuth();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todas' | 'noLeidas'>('noLeidas');

  const getUserEmail = (): string => {
    try {
      if (!token) return '';
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || '';
    } catch {
      return '';
    }
  };

  const email = getUserEmail();

  const fetchMensajes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await comunicacionService.getByDestinatario(email);
      setMensajes(res.data);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (email) fetchMensajes();
  }, [fetchMensajes, email]);

  const handleMarcarLeida = async (id: number) => {
    try {
      await comunicacionService.marcarLeido(id);
      fetchMensajes();
    } catch (err) {
      console.error('Error al marcar como leida:', err);
    }
  };

  const handleMarcarTodas = async () => {
    try {
      const noLeidas = mensajes.filter((m) => m.estado !== 'LEIDO');
      await Promise.all(noLeidas.map((m) => comunicacionService.marcarLeido(m.id)));
      fetchMensajes();
    } catch (err) {
      console.error('Error al marcar todas:', err);
    }
  };

  const mensajesFiltrados = filtro === 'noLeidas'
    ? mensajes.filter((m) => m.estado !== 'LEIDO')
    : mensajes;

  const noLeidasCount = mensajes.filter((m) => m.estado !== 'LEIDO').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Notificaciones</h2>
            {noLeidasCount > 0 && (
              <p className="text-sm text-gray-500">{noLeidasCount} sin leer</p>
            )}
          </div>
        </div>
        {noLeidasCount > 0 && (
          <button
            onClick={handleMarcarTodas}
            className="flex items-center px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
          >
            <CheckCheck className="w-4 h-4 mr-2" /> Marcar todas como leidas
          </button>
        )}
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setFiltro('noLeidas')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filtro === 'noLeidas' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          No leidas {noLeidasCount > 0 && `(${noLeidasCount})`}
        </button>
        <button
          onClick={() => setFiltro('todas')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filtro === 'todas' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : mensajesFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay notificaciones</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mensajesFiltrados.map((msg) => {
            const isUnread = msg.estado !== 'LEIDO';
            const esAusencia = msg.asunto?.toLowerCase().includes('ausencia');

            return (
              <div
                key={msg.id}
                className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                  esAusencia ? 'border-red-500' : 'border-blue-500'
                } ${isUnread ? 'ring-1 ring-blue-200' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${esAusencia ? 'bg-red-100' : 'bg-blue-100'}`}>
                      {esAusencia ? (
                        <Bell className="w-5 h-5 text-red-600" />
                      ) : (
                        <MailOpen className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-semibold text-gray-800">
                          {msg.asunto || 'Sin asunto'}
                        </span>
                        {isUnread && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            Nuevo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">De: {msg.remitente}</p>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{msg.contenido}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(msg.fechaCreacion).toLocaleString('es-ES')}
                      </p>
                    </div>
                  </div>
                  {isUnread && (
                    <button
                      onClick={() => handleMarcarLeida(msg.id)}
                      title="Marcar como leida"
                      className="text-green-600 hover:text-green-800 ml-2"
                    >
                      <CheckCheck className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
