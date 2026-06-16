import api from './api';
import type {
  Asignatura,
  AsignaturaRequest,
  CursoAsignatura,
  CursoAsignaturaRequest,
  AcademicoEstudiante,
  AcademicoEstudianteRequest,
  AcademicoDocente,
  AcademicoDocenteRequest,
  AcademicoCurso,
  AcademicoCursoRequest,
  AcademicoEvaluacion,
  AcademicoEvaluacionRequest,
  AcademicoNota,
  AcademicoNotaRequest,
} from '../types';

const BASE = '/academico';

export const academicoService = {
  // Asignaturas
  getAsignaturas: () => api.get<Asignatura[]>(`${BASE}/asignaturas`),
  getAsignatura: (id: number) => api.get<Asignatura>(`${BASE}/asignaturas/${id}`),
  createAsignatura: (data: AsignaturaRequest) => api.post<Asignatura>(`${BASE}/asignaturas`, data),
  updateAsignatura: (id: number, data: AsignaturaRequest) => api.put<Asignatura>(`${BASE}/asignaturas/${id}`, data),
  deleteAsignatura: (id: number) => api.delete(`${BASE}/asignaturas/${id}`),

  // Curso-Asignatura
  getCursoAsignaturas: () => api.get<CursoAsignatura[]>(`${BASE}/cursos-asignaturas`),
  getCursoAsignatura: (id: number) => api.get<CursoAsignatura>(`${BASE}/cursos-asignaturas/${id}`),
  getCursoAsignaturasByDocente: (docenteId: number) => api.get<CursoAsignatura[]>(`${BASE}/cursos-asignaturas/docente/${docenteId}`),
  getCursoAsignaturasByCurso: (cursoId: number) => api.get<CursoAsignatura[]>(`${BASE}/cursos-asignaturas/curso/${cursoId}`),
  createCursoAsignatura: (data: CursoAsignaturaRequest) => api.post<CursoAsignatura>(`${BASE}/cursos-asignaturas`, data),
  updateCursoAsignatura: (id: number, data: CursoAsignaturaRequest) => api.put<CursoAsignatura>(`${BASE}/cursos-asignaturas/${id}`, data),
  deleteCursoAsignatura: (id: number) => api.delete(`${BASE}/cursos-asignaturas/${id}`),

  // Estudiantes academicos
  getEstudiantes: () => api.get<AcademicoEstudiante[]>(`${BASE}/estudiantes`),
  getEstudiante: (id: number) => api.get<AcademicoEstudiante>(`${BASE}/estudiantes/${id}`),
  createEstudiante: (data: AcademicoEstudianteRequest) => api.post<AcademicoEstudiante>(`${BASE}/estudiantes`, data),
  updateEstudiante: (id: number, data: AcademicoEstudianteRequest) => api.put<AcademicoEstudiante>(`${BASE}/estudiantes/${id}`, data),
  deleteEstudiante: (id: number) => api.delete(`${BASE}/estudiantes/${id}`),

  // Docentes academicos
  getDocentes: () => api.get<AcademicoDocente[]>(`${BASE}/docentes`),
  getDocente: (id: number) => api.get<AcademicoDocente>(`${BASE}/docentes/${id}`),
  createDocente: (data: AcademicoDocenteRequest) => api.post<AcademicoDocente>(`${BASE}/docentes`, data),
  updateDocente: (id: number, data: AcademicoDocenteRequest) => api.put<AcademicoDocente>(`${BASE}/docentes/${id}`, data),
  deleteDocente: (id: number) => api.delete(`${BASE}/docentes/${id}`),

  // Cursos academicos
  getCursos: () => api.get<AcademicoCurso[]>(`${BASE}/cursos`),
  getCurso: (id: number) => api.get<AcademicoCurso>(`${BASE}/cursos/${id}`),
  createCurso: (data: AcademicoCursoRequest) => api.post<AcademicoCurso>(`${BASE}/cursos`, data),
  updateCurso: (id: number, data: AcademicoCursoRequest) => api.put<AcademicoCurso>(`${BASE}/cursos/${id}`, data),
  deleteCurso: (id: number) => api.delete(`${BASE}/cursos/${id}`),

  // Evaluaciones academicas
  getEvaluaciones: () => api.get<AcademicoEvaluacion[]>(`${BASE}/evaluaciones`),
  getEvaluacion: (id: number) => api.get<AcademicoEvaluacion>(`${BASE}/evaluaciones/${id}`),
  createEvaluacion: (data: AcademicoEvaluacionRequest) => api.post<AcademicoEvaluacion>(`${BASE}/evaluaciones`, data),
  updateEvaluacion: (id: number, data: AcademicoEvaluacionRequest) => api.put<AcademicoEvaluacion>(`${BASE}/evaluaciones/${id}`, data),
  deleteEvaluacion: (id: number) => api.delete(`${BASE}/evaluaciones/${id}`),

  // Notas academicas
  getNotas: () => api.get<AcademicoNota[]>(`${BASE}/notas`),
  getNota: (id: number) => api.get<AcademicoNota>(`${BASE}/notas/${id}`),
  getNotasByEstudiante: (estudianteId: number) => api.get<AcademicoNota[]>(`${BASE}/notas/estudiante/${estudianteId}`),
  createNota: (data: AcademicoNotaRequest) => api.post<AcademicoNota>(`${BASE}/notas`, data),
  updateNota: (id: number, data: AcademicoNotaRequest) => api.put<AcademicoNota>(`${BASE}/notas/${id}`, data),
  deleteNota: (id: number) => api.delete(`${BASE}/notas/${id}`),
};
