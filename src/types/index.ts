export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rolId: number;
  createdAt?: string;
}

export interface Role {
  id: number;
  nombre: string;
}

export interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rolId: number;
  cursoId: number;
  matricula: string;
  createdAt?: string;
}

export interface Docente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rolId: number;
  numeroColegiatura: string;
  especialidad?: string;
  gradoAcademico?: string;
  createdAt?: string;
}

export interface Apoderado {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rolId: number;
  parentesco: string;
  telefono: string;
  direccion?: string;
  documentoIdentidad: string;
  createdAt?: string;
}

export interface Perfil {
  id: number;
  userId: number;
  biografia?: string;
  fotoUrl?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Curso {
  id: number;
  nombre: string;
  nivel: string;
  anio: number;
}

export interface Evaluacion {
  id: number;
  nombre: string;
  descripcion: string;
  cursoId: number;
  fecha: string;
  puntajeMaximo: number;
  createdAt?: string;
}

export interface Nota {
  id: number;
  estudianteId: number;
  evaluacionId: number;
  nota: number;
}

export interface AuthResponse {
  token: string;
  message: string;
  userId: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rolNombre?: string;
}

export type UserRole = 'ADMINISTRADOR' | 'DOCENTE' | 'ESTUDIANTE' | 'APODERADO' | 'USUARIO';

// ==================== ACADEMICO MS ====================

export interface AcademicoEstudiante {
  id: number;
  nombre: string;
  email: string;
  matricula: string;
  telefono?: string;
}

export interface AcademicoEstudianteRequest {
  nombre: string;
  email: string;
  matricula: string;
  telefono?: string;
}

export interface AcademicoDocente {
  id: number;
  nombre: string;
  email: string;
  especialidad?: string;
  telefono?: string;
}

export interface AcademicoDocenteRequest {
  nombre: string;
  email: string;
  especialidad?: string;
  telefono?: string;
}

export interface AcademicoCurso {
  id: number;
  nombre: string;
  descripcion?: string;
  anio: number;
  periodo: string;
}

export interface AcademicoCursoRequest {
  nombre: string;
  descripcion?: string;
  anio: number;
  periodo: string;
}

export interface Asignatura {
  id: number;
  nombre: string;
  descripcion?: string;
  creditos: number;
}

export interface AsignaturaRequest {
  nombre: string;
  descripcion?: string;
  creditos: number;
}

export interface CursoAsignatura {
  id: number;
  cursoId: number;
  cursoNombre: string;
  asignaturaId: number;
  asignaturaNombre: string;
  docenteId: number;
  docenteNombre: string;
  semestre: string;
}

export interface CursoAsignaturaRequest {
  cursoId: number;
  asignaturaId: number;
  docenteId: number;
  semestre: string;
}

export interface AcademicoEvaluacion {
  id: number;
  nombre: string;
  descripcion?: string;
  fecha: string;
  peso: number;
  notaMaxima: number;
  cursoAsignaturaId: number;
}

export interface AcademicoEvaluacionRequest {
  nombre: string;
  descripcion?: string;
  fecha: string;
  peso: number;
  notaMaxima: number;
  cursoAsignaturaId: number;
}

export interface AcademicoNota {
  id: number;
  estudianteId: number;
  estudianteNombre: string;
  valor: number;
  evaluacionId: number;
  evaluacionNombre: string;
}

export interface AcademicoNotaRequest {
  estudianteId: number;
  valor: number;
  evaluacionId: number;
}

// ==================== COMUNICACION MS ====================

export interface Mensaje {
  id: number;
  remitente: string;
  destinatario: string;
  contenido: string;
  asunto?: string;
  estado: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface MensajeRequest {
  remitente: string;
  destinatario: string;
  contenido: string;
  asunto?: string;
}

// ==================== ASISTENCIA MS ====================

export interface Asistencia {
  id: number;
  userId: string;
  fecha: string;
  horaEntrada?: string;
  horaSalida?: string;
  estado: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AsistenciaRequest {
  userId: string;
  fecha: string;
  horaEntrada?: string;
  horaSalida?: string;
  estado: string;
  observaciones?: string;
}

export interface AsistenciaUpdateRequest {
  fecha?: string;
  horaEntrada?: string;
  horaSalida?: string;
  estado?: string;
  observaciones?: string;
}

// ==================== ESTUDIANTE-APODERADO ====================

export interface EstudianteApoderado {
  id: number;
  estudianteId: number;
  estudianteNombre: string;
  estudianteApellido: string;
  apoderadoId: number;
  apoderadoNombre: string;
  apoderadoApellido: string;
  apoderadoEmail: string;
  parentesco: string;
}

export interface EstudianteApoderadoRequest {
  estudianteId: number;
  apoderadoId: number;
  parentesco: string;
}
