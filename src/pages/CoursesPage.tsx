import { useState, useEffect } from 'react';
import { cursoService } from '../services/cursoService';
import type { Curso } from '../types';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Curso | null>(null);
  const [formData, setFormData] = useState({ nombre: '', nivel: '', anio: new Date().getFullYear() });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await cursoService.getAll();
      setCourses(data);
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
        await cursoService.update(editing.id, formData);
      } else {
        await cursoService.create(formData);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ nombre: '', nivel: '', anio: new Date().getFullYear() });
      loadCourses();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro?')) {
      try {
        await cursoService.delete(id);
        loadCourses();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
          <Plus className="w-5 h-5 mr-2" /> Nuevo Curso
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Año</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4 text-sm text-gray-500">{c.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{c.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.nivel}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.anio}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => { setEditing(c); setFormData({ nombre: c.nombre, nivel: c.nivel, anio: c.anio }); setShowModal(true); }} className="text-blue-600 hover:text-blue-900 mr-3"><Edit className="w-5 h-5 inline" /></button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5 inline" /></button>
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
              <h2 className="text-xl font-bold">{editing ? 'Editar' : 'Nuevo'} Curso</h2>
              <button onClick={() => { setShowModal(false); setEditing(null); }}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <input type="text" placeholder="Nivel" value={formData.nivel} onChange={(e) => setFormData({ ...formData, nivel: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <input type="number" placeholder="Año" value={formData.anio} onChange={(e) => setFormData({ ...formData, anio: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md" required />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">{editing ? 'Actualizar' : 'Crear'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="flex-1 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
