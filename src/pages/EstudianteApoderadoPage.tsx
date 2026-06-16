import { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Search } from 'lucide-react';
import { estudianteApoderadoService } from '../services/estudianteApoderadoService';
import { estudianteService } from '../services/estudianteService';
import { apoderadoService } from '../services/apoderadoService';
import type { EstudianteApoderado, Estudiante, Apoderado } from '../types';

export default function EstudianteApoderadoPage() {
  const [relaciones, setRelaciones] = useState<EstudianteApoderado[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [apoderados, setApoderados] = useState<Apoderado[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    estudianteId: '',
    apoderadoId: '',
    parentesco: '',
  });

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [relRes, estRes, apoRes] = await Promise.all([
        estudianteApoderadoService.getAll(),
        estudianteService.getAll(),
        apoderadoService.getAll(),
      ]);
      setRelaciones(relRes.data);
      setEstudiantes(estRes);
      setApoderados(apoRes);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await estudianteApoderadoService.create({
        estudianteId: Number(form.estudianteId),
        apoderadoId: Number(form.apoderadoId),
        parentesco: form.parentesco,
      });
      setModalOpen(false);
      setForm({ estudianteId: '', apoderadoId: '', parentesco: '' });
      fetchAll();
    } catch (err) {
      console.error('Error al crear relacion:', err);
      alert('Error al crear la relacion. Verifique que no exista ya.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar esta relacion?')) return;
    try {
      await estudianteApoderadoService.delete(id);
      fetchAll();
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  const filtered = relaciones.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.estudianteNombre?.toLowerCase().includes(q) ||
      r.apoderadoNombre?.toLowerCase().includes(q) ||
      r.parentesco?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Estudiante - Apoderado</h2>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          disabled={estudiantes.length === 0 || apoderados.length === 0}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" /> Asignar Apoderado
        </button>
      </div>

      {(estudiantes.length === 0 || apoderados.length === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            Necesita tener estudiantes y apoderados registrados antes de crear relaciones.
          </p>
        </div>
      )}

      <div className="flex items-center space-x-2 mb-4">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o parentesco..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apoderado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email Apoderado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parentesco</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {r.estudianteNombre} {r.estudianteApellido}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {r.apoderadoNombre} {r.apoderadoApellido}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{r.apoderadoEmail}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                      {r.parentesco}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No hay relaciones registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Asignar Apoderado a Estudiante</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estudiante</label>
                <select
                  required
                  value={form.estudianteId}
                  onChange={(e) => setForm({ ...form, estudianteId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Seleccione un estudiante</option>
                  {estudiantes.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.nombre} {est.apellido} - {est.matricula}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apoderado</label>
                <select
                  required
                  value={form.apoderadoId}
                  onChange={(e) => setForm({ ...form, apoderadoId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Seleccione un apoderado</option>
                  {apoderados.map((apo) => (
                    <option key={apo.id} value={apo.id}>
                      {apo.nombre} {apo.apellido} - {apo.documentoIdentidad}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parentesco</label>
                <select
                  required
                  value={form.parentesco}
                  onChange={(e) => setForm({ ...form, parentesco: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Seleccione parentesco</option>
                  <option value="Padre">Padre</option>
                  <option value="Madre">Madre</option>
                  <option value="Tutor Legal">Tutor Legal</option>
                  <option value="Abuelo">Abuelo/a</option>
                  <option value="Tio">Tio/a</option>
                  <option value="Hermano">Hermano/a</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Asignar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
