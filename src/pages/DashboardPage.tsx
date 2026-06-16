import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  GraduationCap,
  School,
  UserCheck,
  BookOpen,
  ClipboardList,
  Award,
  Mail,
  Bell,
  CalendarCheck,
  FileText,
} from 'lucide-react';

interface StatCard {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count: string;
  color: string;
  path: string;
}

const adminStats: StatCard[] = [
  { label: 'Usuarios', icon: Users, count: '--', color: 'bg-blue-500', path: '/users' },
  { label: 'Estudiantes', icon: GraduationCap, count: '--', color: 'bg-green-500', path: '/students' },
  { label: 'Docentes', icon: School, count: '--', color: 'bg-purple-500', path: '/teachers' },
  { label: 'Apoderados', icon: UserCheck, count: '--', color: 'bg-yellow-500', path: '/guardians' },
  { label: 'Cursos', icon: BookOpen, count: '--', color: 'bg-red-500', path: '/courses' },
  { label: 'Evaluaciones', icon: ClipboardList, count: '--', color: 'bg-indigo-500', path: '/evaluations' },
  { label: 'Notas', icon: Award, count: '--', color: 'bg-pink-500', path: '/grades' },
];

const docenteStats: StatCard[] = [
  { label: 'Cursos', icon: BookOpen, count: '--', color: 'bg-red-500', path: '/courses' },
  { label: 'Asignaturas', icon: FileText, count: '--', color: 'bg-blue-500', path: '/asignaturas' },
  { label: 'Evaluaciones', icon: ClipboardList, count: '--', color: 'bg-indigo-500', path: '/evaluations' },
  { label: 'Calificaciones', icon: Award, count: '--', color: 'bg-pink-500', path: '/grades' },
  { label: 'Asistencia', icon: CalendarCheck, count: '--', color: 'bg-green-500', path: '/asistencia' },
  { label: 'Mensajes', icon: Mail, count: '--', color: 'bg-yellow-500', path: '/mensajes' },
];

const estudianteStats: StatCard[] = [
  { label: 'Calificaciones', icon: Award, count: '--', color: 'bg-pink-500', path: '/grades' },
  { label: 'Mensajes', icon: Mail, count: '--', color: 'bg-blue-500', path: '/mensajes' },
  { label: 'Notificaciones', icon: Bell, count: '--', color: 'bg-yellow-500', path: '/notificaciones' },
];

const apoderadoStats: StatCard[] = [
  { label: 'Calificaciones', icon: Award, count: '--', color: 'bg-pink-500', path: '/grades' },
  { label: 'Mensajes', icon: Mail, count: '--', color: 'bg-blue-500', path: '/mensajes' },
  { label: 'Notificaciones', icon: Bell, count: '--', color: 'bg-yellow-500', path: '/notificaciones' },
];

const usuarioStats: StatCard[] = [
  { label: 'Calificaciones', icon: Award, count: '--', color: 'bg-pink-500', path: '/grades' },
  { label: 'Mensajes', icon: Mail, count: '--', color: 'bg-blue-500', path: '/mensajes' },
  { label: 'Notificaciones', icon: Bell, count: '--', color: 'bg-yellow-500', path: '/notificaciones' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const rol = user?.rol || '';

  const stats =
    rol === 'ADMINISTRADOR' ? adminStats :
    rol === 'DOCENTE' ? docenteStats :
    rol === 'ESTUDIANTE' ? estudianteStats :
    rol === 'APODERADO' ? apoderadoStats :
    usuarioStats;

  const welcomeMessage =
    rol === 'ADMINISTRADOR'
      ? 'Panel de administración. Gestiona usuarios, cursos y toda la plataforma educativa.'
      : rol === 'DOCENTE'
      ? 'Panel docente. Gestiona tus cursos, evaluaciones, calificaciones y asistencia.'
      : rol === 'ESTUDIANTE'
      ? 'Panel de estudiante. Revisa tus calificaciones, mensajes y notificaciones.'
      : rol === 'APODERADO'
      ? 'Panel de apoderado. Revisa las calificaciones de tu pupilo, mensajes y notificaciones.'
      : 'Revisa tus calificaciones, mensajes y notificaciones.';

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Bienvenido, <span className="font-semibold">{user?.nombre} {user?.apellido}</span> ({rol})
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">SmartBook</h2>
        <p className="text-gray-600">{welcomeMessage}</p>
      </div>
    </div>
  );
}
