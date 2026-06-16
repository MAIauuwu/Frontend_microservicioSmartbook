import { useState, useEffect } from 'react';
import { evaluacionService } from '../services/evaluacionService';
import { cursoService } from '../services/cursoService';
import type { Evaluacion, Curso } from '../types';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluacion[]>([]);
  const [courses, setCourses] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Evaluacion | null>(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', cursoId: 0, fecha: '', puntajeMaximo: 100 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [evalData, courseData] = await Promise.all([
        evaluacionService.getAll(),
        cursoService.getAll(),
      ]);
      setEvaluations(evalData);
      setCourses(courseData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await evaluacionService.update(editing.id, formData);
      } else {
        await evaluacionService.create(formData);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ nombre: '', descripcion: '', cursoId: 0, fecha: '', puntajeMaximo: 100 });
      loadData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro?')) {
      try {
        await evaluacionService.delete(id);
        loadData();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Evaluaciones</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          <Plus className="w-5 h-5 mr-2" /> Nueva Evaluación
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Puntaje Máx.</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {evaluations.map((ev) => (
              <tr key={ev.id}>
                <td className="px-6 py-4 text-sm text-gray-500">{ev.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{ev.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(ev.fecha).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{ev.puntajeMaximo}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => { setEditing(ev); setFormData({ nombre: ev.nombre, descripcion: ev.descripcion, cursoId: ev.cursoId, fecha: ev.fecha.split('T')[0], puntajeMaximo: ev.puntajeMaximo }); setShowModal(true); }} className="text-blue-600 hover:text-blue-900 mr-3"><Edit className="w-5 h-5 inline" /></button>
                  <button onClick={() => handleDelete(ev.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editing ? 'Editar' : 'Nueva'} Evaluación</h2>
              <button onClick={() => { setShowModal(false); setEditing(null); }}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <textarea placeholder="Descripción" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <input type="date" placeholder="Fecha" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <input type="number" placeholder="Puntaje Máximo" value={formData.puntajeMaximo} onChange={(e) => setFormData({ ...formData, puntajeMaximo: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md" required />
              <select value={formData.cursoId} onChange={(e) => setFormData({ ...formData, cursoId: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md" required>
                <option value={0}>Seleccionar Curso</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{editing ? 'Actualizar' : 'Crear'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="flex-1 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
