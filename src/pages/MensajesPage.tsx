import { useState, useEffect, useCallback } from 'react';
import { Send, Mail, MailOpen, Trash2, Plus } from 'lucide-react';
import { comunicacionService } from '../services/comunicacionService';
import { useAuth } from '../context/AuthContext';
import type { Mensaje, MensajeRequest } from '../types';

type Tab = 'recibidos' | 'enviados';

export default function MensajesPage() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('recibidos');
  const [composeOpen, setComposeOpen] = useState(false);
  const [form, setForm] = useState<MensajeRequest>({ remitente: '', destinatario: '', contenido: '', asunto: '' });
  const { token } = useAuth();

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
      const res = tab === 'recibidos'
        ? await comunicacionService.getByDestinatario(email)
        : await comunicacionService.getByRemitente(email);
      setMensajes(res.data);
    } catch (err) {
      console.error('Error al cargar mensajes:', err);
    } finally {
      setLoading(false);
    }
  }, [tab, email]);

  useEffect(() => { if (email) fetchMensajes(); }, [fetchMensajes, email]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await comunicacionService.create({ ...form, remitente: email });
      setComposeOpen(false);
      setForm({ remitente: '', destinatario: '', contenido: '', asunto: '' });
      fetchMensajes();
    } catch (err) {
      console.error('Error al enviar:', err);
    }
  };

  const handleMarcarLeido = async (id: number) => {
    try {
      await comunicacionService.marcarLeido(id);
      fetchMensajes();
    } catch (err) {
      console.error('Error al marcar:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar este mensaje?')) return;
    try {
      await comunicacionService.delete(id);
      fetchMensajes();
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  const estadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      ENVIADO: 'bg-blue-100 text-blue-800',
      LEIDO: 'bg-green-100 text-green-800',
      ELIMINADO: 'bg-red-100 text-red-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mensajes</h2>
        <button onClick={() => setComposeOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Mensaje
        </button>
      </div>

      <div className="flex space-x-4 mb-4">
        <button onClick={() => setTab('recibidos')} className={`px-4 py-2 rounded-lg font-medium ${tab === 'recibidos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          <Mail className="w-4 h-4 inline mr-2" />Recibidos
        </button>
        <button onClick={() => setTab('enviados')} className={`px-4 py-2 rounded-lg font-medium ${tab === 'enviados' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          <Send className="w-4 h-4 inline mr-2" />Enviados
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="space-y-3">
          {mensajes.map((msg) => (
            <div key={msg.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-semibold text-gray-700">
                      {tab === 'recibidos' ? `De: ${msg.remitente}` : `Para: ${msg.destinatario}`}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoBadge(msg.estado)}`}>
                      {msg.estado}
                    </span>
                  </div>
                  {msg.asunto && <p className="text-sm font-medium text-gray-800">{msg.asunto}</p>}
                  <p className="text-sm text-gray-600 mt-1">{msg.contenido}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(msg.fechaCreacion).toLocaleString('es-ES')}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  {msg.estado !== 'LEIDO' && (
                    <button onClick={() => handleMarcarLeido(msg.id)} title="Marcar como leido" className="text-green-600 hover:text-green-800">
                      <MailOpen className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(msg.id)} title="Eliminar" className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {mensajes.length === 0 && (
            <p className="text-center text-gray-500 py-8">No hay mensajes {tab === 'recibidos' ? 'recibidos' : 'enviados'}</p>
          )}
        </div>
      )}

      {composeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4">Nuevo Mensaje</h3>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Para (email)</label>
                <input type="email" required value={form.destinatario} onChange={(e) => setForm({ ...form, destinatario: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                <input type="text" value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea required rows={4} value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setComposeOpen(false)} className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" /> Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
