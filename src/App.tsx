import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import StudentsPage from './pages/StudentsPage';
import TeachersPage from './pages/TeachersPage';
import GuardiansPage from './pages/GuardiansPage';
import CoursesPage from './pages/CoursesPage';
import EvaluationsPage from './pages/EvaluationsPage';
import GradesPage from './pages/GradesPage';
import RolesPage from './pages/RolesPage';
import ProfilePage from './pages/ProfilePage';
import AsignaturasPage from './pages/AsignaturasPage';
import CursoAsignaturasPage from './pages/CursoAsignaturasPage';
import MensajesPage from './pages/MensajesPage';
import AsistenciaPage from './pages/AsistenciaPage';
import NotificacionesPage from './pages/NotificacionesPage';
import EstudianteApoderadoPage from './pages/EstudianteApoderadoPage';

const ADMIN = ['ADMINISTRADOR'];
const ADMIN_DOCENTE = ['ADMINISTRADOR', 'DOCENTE'];

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.rol)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={ADMIN}>
            <Layout>
              <UsersPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={ADMIN}>
            <Layout>
              <StudentsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <ProtectedRoute allowedRoles={ADMIN}>
            <Layout>
              <TeachersPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/guardians"
        element={
          <ProtectedRoute allowedRoles={ADMIN}>
            <Layout>
              <GuardiansPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute allowedRoles={ADMIN_DOCENTE}>
            <Layout>
              <CoursesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/evaluations"
        element={
          <ProtectedRoute allowedRoles={ADMIN_DOCENTE}>
            <Layout>
              <EvaluationsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grades"
        element={
          <ProtectedRoute>
            <Layout>
              <GradesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/roles"
        element={
          <ProtectedRoute allowedRoles={ADMIN}>
            <Layout>
              <RolesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/asignaturas"
        element={
          <ProtectedRoute allowedRoles={ADMIN_DOCENTE}>
            <Layout>
              <AsignaturasPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/curso-asignaturas"
        element={
          <ProtectedRoute allowedRoles={ADMIN_DOCENTE}>
            <Layout>
              <CursoAsignaturasPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mensajes"
        element={
          <ProtectedRoute>
            <Layout>
              <MensajesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/asistencia"
        element={
          <ProtectedRoute allowedRoles={ADMIN_DOCENTE}>
            <Layout>
              <AsistenciaPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notificaciones"
        element={
          <ProtectedRoute>
            <Layout>
              <NotificacionesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/estudiante-apoderado"
        element={
          <ProtectedRoute allowedRoles={ADMIN}>
            <Layout>
              <EstudianteApoderadoPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
