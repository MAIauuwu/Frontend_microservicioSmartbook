import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { academicoService } from '../services/academicoService';
import type { Asignatura } from '../types';

interface FormData {
  nombre: string;
  descripcion: string;
  creditos: number;
}

const emptyForm: FormData = { nombre: '', descripcion: '', creditos: 1 };

export default function AsignaturasPage() {
  const [items, setItems] = useState<Asignatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await academicoService.getAsignaturas();
      setItems(res.data);
    } catch (err) {
      console.error('Error al cargar asignaturas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item: Asignatura) => {
    setEditingId(item.id);
    setForm({ nombre: item.nombre, descripcion: item.descripcion || '', creditos: item.creditos });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { nombre: form.nombre, descripcion: form.descripcion || undefined, creditos: form.creditos };
      if (editingId) {
        await academicoService.updateAsignatura(editingId, payload);
      } else {
        await academicoService.createAsignatura(payload);
      }
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar esta asignatura?')) return;
    try {
      await academicoService.deleteAsignatura(id);
      fetchAll();
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Asignaturas</h2>
        <button onClick={openCreate} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Nueva Asignatura
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripcion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creditos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.descripcion || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.creditos}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => openEdit(item)} className="text-yellow-600 hover:text-yellow-800"><Pencil className="w-4 h-4 inline" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4 inline" /></button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No hay asignaturas registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editingId ? 'Editar' : 'Nueva'} Asignatura</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                <input type="text" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Creditos</label>
                <input type="number" required min={1} value={form.creditos} onChange={(e) => setForm({ ...form, creditos: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
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
