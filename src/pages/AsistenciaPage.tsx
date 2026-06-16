import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { asistenciaService } from '../services/asistenciaService';
import type { Asistencia, AsistenciaRequest, AsistenciaUpdateRequest } from '../types';

type FormData = {
  userId: string;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
  estado: string;
  observaciones: string;
};

const emptyForm: FormData = { userId: '', fecha: '', horaEntrada: '', horaSalida: '', estado: 'PRESENTE', observaciones: '' };

const ESTADOS = ['PRESENTE', 'AUSENTE', 'TARDANZA', 'PERMISO', 'JUSTIFICADO'];

export default function AsistenciaPage() {
  const [items, setItems] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [filterEstado, setFilterEstado] = useState('');
  const [filterUserId, setFilterUserId] = useState('');

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      let res;
      if (filterUserId) {
        res = await asistenciaService.getByUsuario(filterUserId);
      } else if (filterEstado) {
        res = await asistenciaService.getByEstado(filterEstado);
      } else {
        res = await asistenciaService.getAll();
      }
      setItems(res.data);
    } catch (err) {
      console.error('Error al cargar asistencias:', err);
    } finally {
      setLoading(false);
    }
  }, [filterUserId, filterEstado]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item: Asistencia) => {
    setEditingId(item.id);
    setForm({
      userId: item.userId,
      fecha: item.fecha,
      horaEntrada: item.horaEntrada || '',
      horaSalida: item.horaSalida || '',
      estado: item.estado,
      observaciones: item.observaciones || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const payload: AsistenciaUpdateRequest = {
          fecha: form.fecha || undefined,
          horaEntrada: form.horaEntrada || undefined,
          horaSalida: form.horaSalida || undefined,
          estado: form.estado || undefined,
          observaciones: form.observaciones || undefined,
        };
        await asistenciaService.update(editingId, payload);
      } else {
        const payload: AsistenciaRequest = {
          userId: form.userId,
          fecha: form.fecha,
          horaEntrada: form.horaEntrada || undefined,
          horaSalida: form.horaSalida || undefined,
          estado: form.estado,
          observaciones: form.observaciones || undefined,
        };
        await asistenciaService.create(payload);
      }
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar este registro de asistencia?')) return;
    try {
      await asistenciaService.delete(id);
      fetchAll();
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  const estadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      PRESENTE: 'bg-green-100 text-green-800',
      AUSENTE: 'bg-red-100 text-red-800',
      TARDANZA: 'bg-yellow-100 text-yellow-800',
      PERMISO: 'bg-blue-100 text-blue-800',
      JUSTIFICADO: 'bg-purple-100 text-purple-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Registro de Asistencia</h2>
        <button onClick={openCreate} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Registrar Asistencia
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Filtrar por User ID..." value={filterUserId} onChange={(e) => setFilterUserId(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        {(filterEstado || filterUserId) && (
          <button onClick={() => { setFilterEstado(''); setFilterUserId(''); }}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">Limpiar filtros</button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entrada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salida</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Obs.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.userId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.fecha}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.horaEntrada || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.horaSalida || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColor(item.estado)}`}>{item.estado}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.observaciones || '-'}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => openEdit(item)} className="text-yellow-600 hover:text-yellow-800"><Pencil className="w-4 h-4 inline" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4 inline" /></button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-4 text-center text-gray-500">No hay registros de asistencia</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editingId ? 'Editar' : 'Registrar'} Asistencia</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <input type="text" required={!!editingId} disabled={!!editingId} value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input type="date" required value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Entrada</label>
                  <input type="time" value={form.horaEntrada} onChange={(e) => setForm({ ...form, horaEntrada: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Salida</label>
                  <input type="time" value={form.horaSalida} onChange={(e) => setForm({ ...form, horaSalida: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select required value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea rows={2} value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
