import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { academicoService } from '../services/academicoService';
import type { CursoAsignatura, CursoAsignaturaRequest, AcademicoCurso, Asignatura, AcademicoDocente } from '../types';

interface FormData {
  cursoId: number;
  asignaturaId: number;
  docenteId: number;
  semestre: string;
}

const emptyForm: FormData = { cursoId: 0, asignaturaId: 0, docenteId: 0, semestre: '' };

export default function CursoAsignaturasPage() {
  const [items, setItems] = useState<CursoAsignatura[]>([]);
  const [cursos, setCursos] = useState<AcademicoCurso[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [docentes, setDocentes] = useState<AcademicoDocente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [caRes, cRes, aRes, dRes] = await Promise.all([
        academicoService.getCursoAsignaturas(),
        academicoService.getCursos(),
        academicoService.getAsignaturas(),
        academicoService.getDocentes(),
      ]);
      setItems(caRes.data);
      setCursos(cRes.data);
      setAsignaturas(aRes.data);
      setDocentes(dRes.data);
    } catch (err) {
      console.error('Error al cargar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item: CursoAsignatura) => {
    setEditingId(item.id);
    setForm({ cursoId: item.cursoId, asignaturaId: item.asignaturaId, docenteId: item.docenteId, semestre: item.semestre });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: CursoAsignaturaRequest = { ...form };
      if (editingId) {
        await academicoService.updateCursoAsignatura(editingId, payload);
      } else {
        await academicoService.createCursoAsignatura(payload);
      }
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar esta asignacion?')) return;
    try {
      await academicoService.deleteCursoAsignatura(id);
      fetchAll();
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Asignaciones Curso-Asignatura</h2>
        <button onClick={openCreate} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Nueva Asignacion
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Curso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asignatura</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Docente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semestre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.cursoNombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.asignaturaNombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.docenteNombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.semestre}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => openEdit(item)} className="text-yellow-600 hover:text-yellow-800"><Pencil className="w-4 h-4 inline" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4 inline" /></button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No hay asignaciones registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editingId ? 'Editar' : 'Nueva'} Asignacion</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                <select required value={form.cursoId} onChange={(e) => setForm({ ...form, cursoId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value={0}>Seleccionar curso</option>
                  {cursos.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asignatura</label>
                <select required value={form.asignaturaId} onChange={(e) => setForm({ ...form, asignaturaId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value={0}>Seleccionar asignatura</option>
                  {asignaturas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Docente</label>
                <select required value={form.docenteId} onChange={(e) => setForm({ ...form, docenteId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value={0}>Seleccionar docente</option>
                  {docentes.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
                <input type="text" required value={form.semestre} onChange={(e) => setForm({ ...form, semestre: e.target.value })}
                  placeholder="Ej: 2024-1" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
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
