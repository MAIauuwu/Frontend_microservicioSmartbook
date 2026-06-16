import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotificaciones } from '../hooks/useNotificaciones';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  UserCheck,
  BookOpen,
  ClipboardList,
  Award,
  UserCircle,
  Shield,
  LogOut,
  Menu,
  X,
  FileText,
  Link2,
  Mail,
  CalendarCheck,
  Bell,
  Heart,
} from 'lucide-react';

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badgePath?: string;
  roles?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
  roles?: string[];
}

const navSections: NavSection[] = [
  {
    title: 'General',
    items: [
      { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    title: 'Gestion de Usuarios',
    roles: ['ADMINISTRADOR'],
    items: [
      { path: '/users', icon: Users, label: 'Usuarios', roles: ['ADMINISTRADOR'] },
      { path: '/students', icon: GraduationCap, label: 'Estudiantes', roles: ['ADMINISTRADOR'] },
      { path: '/teachers', icon: School, label: 'Docentes', roles: ['ADMINISTRADOR'] },
      { path: '/guardians', icon: UserCheck, label: 'Apoderados', roles: ['ADMINISTRADOR'] },
      { path: '/estudiante-apoderado', icon: Heart, label: 'Estudiante-Apoderado', roles: ['ADMINISTRADOR'] },
      { path: '/roles', icon: Shield, label: 'Roles', roles: ['ADMINISTRADOR'] },
    ],
  },
  {
    title: 'Academico',
    items: [
      { path: '/courses', icon: BookOpen, label: 'Cursos', roles: ['ADMINISTRADOR', 'DOCENTE'] },
      { path: '/asignaturas', icon: FileText, label: 'Asignaturas', roles: ['ADMINISTRADOR', 'DOCENTE'] },
      { path: '/curso-asignaturas', icon: Link2, label: 'Asignaciones', roles: ['ADMINISTRADOR', 'DOCENTE'] },
      { path: '/evaluations', icon: ClipboardList, label: 'Evaluaciones', roles: ['ADMINISTRADOR', 'DOCENTE'] },
      { path: '/grades', icon: Award, label: 'Calificaciones' },
    ],
  },
  {
    title: 'Comunicacion',
    items: [
      { path: '/mensajes', icon: Mail, label: 'Mensajes', badgePath: '/mensajes' },
      { path: '/notificaciones', icon: Bell, label: 'Notificaciones', badgePath: '/notificaciones' },
    ],
  },
  {
    title: 'Asistencia',
    roles: ['ADMINISTRADOR', 'DOCENTE'],
    items: [
      { path: '/asistencia', icon: CalendarCheck, label: 'Asistencia', roles: ['ADMINISTRADOR', 'DOCENTE'] },
    ],
  },
  {
    title: '',
    items: [
      { path: '/profile', icon: UserCircle, label: 'Perfil' },
    ],
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotificaciones();

  const userRol = user?.rol || '';

  const visibleSections = navSections
    .filter((section) => !section.roles || section.roles.includes(userRol))
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.roles || item.roles.includes(userRol)),
    }))
    .filter((section) => section.items.length > 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-gray-900 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <h1 className="text-xl font-bold text-white">SmartBook</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {user && (
          <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
            <p className="text-sm font-medium text-white truncate">{user.nombre} {user.apellido}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-blue-300 bg-blue-900/50 rounded-full">
              {userRol}
            </span>
          </div>
        )}
        <nav className="mt-4 px-2 space-y-1">
          {visibleSections.map((section, si) => (
            <div key={si}>
              {section.title && (
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{section.title}</p>
              )}
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="relative">
                    <item.icon className="w-5 h-5" />
                    {item.badgePath && unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </span>
                  <span className="ml-3">{item.label}</span>
                  {item.badgePath && unreadCount > 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesion
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center h-16 px-4 bg-white shadow sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <Link to="/notificaciones" className="relative p-2 text-gray-500 hover:text-gray-700">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
