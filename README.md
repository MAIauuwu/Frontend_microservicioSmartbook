# Frontend - SmartBook

Plataforma educativa con microservicios. Frontend en React + TypeScript + Vite + Tailwind CSS.

## Caracteristicas

- Autenticacion JWT con control de acceso por roles (ADMINISTRADOR, DOCENTE, USUARIO)
- Dashboard y menu lateral dinamicos segun el rol del usuario
- Rutas protegidas con verificacion de rol (RBAC)
- 18 modulos: Usuarios, Estudiantes, Docentes, Apoderados, Cursos, Asignaturas, Evaluaciones, Calificaciones, Mensajes, Asistencia, Notificaciones, Perfil, etc.

## Requisitos

- Node.js 18+
- Backend SmartBook corriendo (API Gateway en puerto 8080)

## Instalacion

```bash
npm install
npm run dev
```

El frontend se ejecuta en `http://localhost:3000`

## Scripts

| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run lint` | Verificacion ESLint |

## Usuarios de prueba

| Rol | Email | Contrasena |
|---|---|---|
| ADMINISTRADOR | admin@smartbook.com | admin12345 |
| DOCENTE | docente@smartbook.com | docente12345 |
