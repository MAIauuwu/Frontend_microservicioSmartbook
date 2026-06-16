import { useState, useEffect } from 'react';
import { apoderadoService } from '../services/apoderadoService';
import { roleService } from '../services/roleService';
import type { Apoderado, Role } from '../types';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<Apoderado[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Apoderado | null>(null);
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', password: '', rolId: 0,
    parentesco: '', telefono: '', direccion: '', documentoIdentidad: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [data, rolesData] = await Promise.all([
        apoderadoService.getAll(),
        roleService.getAll(),
      ]);
      setGuardians(data);
      setRoles(rolesData);
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
        await apoderadoService.update(editing.id, formData);
      } else {
        await apoderadoService.create(formData);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ nombre: '', apellido: '', email: '', password: '', rolId: 0, parentesco: '', telefono: '', direccion: '', documentoIdentidad: '' });
      loadData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro?')) {
      try {
        await apoderadoService.delete(id);
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
        <h1 className="text-2xl font-bold text-gray-900">Apoderados</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
          <Plus className="w-5 h-5 mr-2" /> Nuevo Apoderado
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parentesco</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {guardians.map((g) => (
              <tr key={g.id}>
                <td className="px-6 py-4 text-sm text-gray-500">{g.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{g.nombre} {g.apellido}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{g.documentoIdentidad}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{g.parentesco}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{g.telefono}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => { setEditing(g); setFormData({ nombre: g.nombre, apellido: g.apellido, email: g.email, password: '', rolId: g.rolId, parentesco: g.parentesco, telefono: g.telefono, direccion: g.direccion || '', documentoIdentidad: g.documentoIdentidad }); setShowModal(true); }} className="text-blue-600 hover:text-blue-900 mr-3"><Edit className="w-5 h-5 inline" /></button>
                  <button onClick={() => handleDelete(g.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5 inline" /></button>
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
              <h2 className="text-xl font-bold">{editing ? 'Editar' : 'Nuevo'} Apoderado</h2>
              <button onClick={() => { setShowModal(false); setEditing(null); }}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <input type="text" placeholder="Apellido" value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <input type="password" placeholder="Contraseña" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 border rounded-md" required={!editing} />
              <input type="text" placeholder="Documento de Identidad" value={formData.documentoIdentidad} onChange={(e) => setFormData({ ...formData, documentoIdentidad: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <input type="text" placeholder="Parentesco" value={formData.parentesco} onChange={(e) => setFormData({ ...formData, parentesco: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <input type="text" placeholder="Teléfono" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
              <input type="text" placeholder="Dirección" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
              <select value={formData.rolId} onChange={(e) => setFormData({ ...formData, rolId: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md" required>
                <option value={0}>Seleccionar Rol</option>
                {roles.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">{editing ? 'Actualizar' : 'Crear'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="flex-1 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
