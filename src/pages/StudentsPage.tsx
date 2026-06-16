import { useState, useEffect } from 'react';
import { estudianteService } from '../services/estudianteService';
import { cursoService } from '../services/cursoService';
import { roleService } from '../services/roleService';
import type { Estudiante, Curso, Role } from '../types';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState<Estudiante[]>([]);
  const [courses, setCourses] = useState<Curso[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Estudiante | null>(null);
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', password: '', rolId: 0, cursoId: 0, matricula: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentsData, coursesData, rolesData] = await Promise.all([
        estudianteService.getAll(),
        cursoService.getAll(),
        roleService.getAll(),
      ]);
      setStudents(studentsData);
      setCourses(coursesData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await estudianteService.update(editing.id, formData);
      } else {
        await estudianteService.create(formData);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ nombre: '', apellido: '', email: '', password: '', rolId: 0, cursoId: 0, matricula: '' });
      loadData();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro?')) {
      try {
        await estudianteService.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Estudiantes</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          <Plus className="w-5 h-5 mr-2" /> Nuevo Estudiante
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4 text-sm text-gray-500">{s.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{s.nombre} {s.apellido}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{s.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{s.matricula}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => { setEditing(s); setFormData({ nombre: s.nombre, apellido: s.apellido, email: s.email, password: '', rolId: s.rolId, cursoId: s.cursoId, matricula: s.matricula }); setShowModal(true); }} className="text-blue-600 hover:text-blue-900 mr-3"><Edit className="w-5 h-5 inline" /></button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5 inline" /></button>
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
              <h2 className="text-xl font-bold">{editing ? 'Editar' : 'Nuevo'} Estudiante</h2>
              <button onClick={() => { setShowModal(false); setEditing(null); }}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <input type="text" placeholder="Apellido" value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <input type="password" placeholder="Contraseña" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 border rounded-md" required={!editing} />
              <input type="text" placeholder="Matrícula" value={formData.matricula} onChange={(e) => setFormData({ ...formData, matricula: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <select value={formData.rolId} onChange={(e) => setFormData({ ...formData, rolId: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md" required>
                <option value={0}>Seleccionar Rol</option>
                {roles.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
              <select value={formData.cursoId} onChange={(e) => setFormData({ ...formData, cursoId: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md" required>
                <option value={0}>Seleccionar Curso</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">{editing ? 'Actualizar' : 'Crear'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="flex-1 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
