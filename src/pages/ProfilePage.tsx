import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { perfilService } from '../services/perfilService';
import type { Perfil } from '../types';
import { Save, UserCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    biografia: '', fotoUrl: '', telefono: '', direccion: '', ciudad: '', pais: ''
  });

  const userId = user?.userId ?? 0;

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const data = await perfilService.getByUserId(userId);
      setPerfil(data);
      setFormData({
        biografia: data.biografia || '',
        fotoUrl: data.fotoUrl || '',
        telefono: data.telefono || '',
        direccion: data.direccion || '',
        ciudad: data.ciudad || '',
        pais: data.pais || '',
      });
    } catch (error) {
      console.log('No profile found, create one');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      if (perfil) {
        await perfilService.update(perfil.id, formData);
      } else {
        const newPerfil = await perfilService.create({ userId, ...formData });
        setPerfil(newPerfil);
      }
      setMessage('Perfil actualizado correctamente');
      loadProfile();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error al guardar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

      {message && (
        <div className={`mb-4 p-3 rounded-md text-sm ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="flex items-center mb-6">
          <UserCircle className="w-16 h-16 text-gray-400" />
          <div className="ml-4">
            <h2 className="text-lg font-semibold">Información Personal</h2>
            <p className="text-sm text-gray-500">Actualiza tu información de perfil</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
            <textarea
              value={formData.biografia}
              onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              placeholder="Cuéntanos sobre ti..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de Foto</label>
            <input
              type="url"
              value={formData.fotoUrl}
              onChange={(e) => setFormData({ ...formData, fotoUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <input
                type="text"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
            <input
              type="text"
              value={formData.pais}
              onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Perfil'}
          </button>
        </form>
      </div>
    </div>
  );
}
