import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { notaService } from '../services/notaService';
import { estudianteService } from '../services/estudianteService';
import { evaluacionService } from '../services/evaluacionService';
import type { Nota, Estudiante, Evaluacion } from '../types';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function GradesPage() {
  const { user } = useAuth();
  const canEdit = user?.rol === 'ADMINISTRADOR' || user?.rol === 'DOCENTE';

  const [grades, setGrades] = useState<Nota[]>([]);
  const [students, setStudents] = useState<Estudiante[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Nota | null>(null);
  const [formData, setFormData] = useState({ estudianteId: 0, evaluacionId: 0, nota: 0 });

  const loadData = useCallback(async () => {
    try {
      const [gradesData, studentsData, evaluationsData] = await Promise.all([
        notaService.getAll(),
        estudianteService.getAll(),
        evaluacionService.getAll(),
      ]);
      setGrades(gradesData);
      setStudents(studentsData);
      setEvaluations(evaluationsData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await notaService.update(editing.id, formData);
      } else {
        await notaService.create(formData);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ estudianteId: 0, evaluacionId: 0, nota: 0 });
      loadData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro?')) {
      try {
        await notaService.delete(id);
        loadData();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const getStudentName = (id: number) => {
    const s = students.find((s) => s.id === id);
    return s ? `${s.nombre} ${s.apellido}` : '-';
  };

  const getEvaluationName = (id: number) => {
    const ev = evaluations.find((ev) => ev.id === id);
    return ev ? ev.nombre : '-';
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calificaciones</h1>
        {canEdit && (
          <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">
            <Plus className="w-5 h-5 mr-2" /> Nueva Nota
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evaluacion</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nota</th>
              {canEdit && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {grades.map((g) => (
              <tr key={g.id}>
                <td className="px-6 py-4 text-sm text-gray-500">{g.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{getStudentName(g.estudianteId)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{getEvaluationName(g.evaluacionId)}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{g.nota}</td>
                {canEdit && (
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => { setEditing(g); setFormData({ estudianteId: g.estudianteId, evaluacionId: g.evaluacionId, nota: g.nota }); setShowModal(true); }} className="text-blue-600 hover:text-blue-900 mr-3"><Edit className="w-5 h-5 inline" /></button>
                    <button onClick={() => handleDelete(g.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5 inline" /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && canEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editing ? 'Editar' : 'Nueva'} Nota</h2>
              <button onClick={() => { setShowModal(false); setEditing(null); }}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select value={formData.estudianteId} onChange={(e) => setFormData({ ...formData, estudianteId: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md" required>
                <option value={0}>Seleccionar Estudiante</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.nombre} {s.apellido}</option>)}
              </select>
              <select value={formData.evaluacionId} onChange={(e) => setFormData({ ...formData, evaluacionId: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md" required>
                <option value={0}>Seleccionar Evaluacion</option>
                {evaluations.map((ev) => <option key={ev.id} value={ev.id}>{ev.nombre}</option>)}
              </select>
              <input type="number" step="0.01" min="0" max="10" placeholder="Nota" value={formData.nota} onChange={(e) => setFormData({ ...formData, nota: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-md" required />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">{editing ? 'Actualizar' : 'Crear'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="flex-1 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
