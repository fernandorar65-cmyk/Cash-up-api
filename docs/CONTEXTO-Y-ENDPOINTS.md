# Cash Up API — contexto y endpoints

## ¿Qué es esta app?

**Cash Up API** es un backend (NestJS + PostgreSQL + TypeORM) para gestionar un flujo simple de **préstamos**:

- **Identidad y acceso (IAM)**: registro, login (JWT) y control por roles (admin/analyst/client).
- **Risk Scoring**: creación de perfil de cliente y **evaluación de riesgo simulada** (scoring) para pruebas.
- **Credit Management**: creación de **solicitudes de crédito**, revisión (aprobar/rechazar), y al aprobar se genera un **préstamo** y su **cronograma de cuotas**.

Arquitectura: organizado por bounded contexts en `src/modules/*` con separación por capas (domain / application / infrastructure / presentation).

## Base URL y documentación

- **Base URL (local)**: `http://localhost:4000`
- **Swagger UI**: `GET /docs`

## Autenticación y roles

- **JWT**: la mayoría de endpoints requieren token Bearer.
- **Roles**:
  - **CLIENT**: crea su perfil de cliente y sus solicitudes.
  - **ANALYST / ADMIN**: revisan solicitudes (bandeja, aprobar/rechazar).
  - **ADMIN**: crea analistas.

## Endpoints disponibles (resumen)

### Salud / prueba

*(Eliminados: endpoints de prueba del root)*

### IAM

#### Auth (`/auth`) (público)

- **POST /auth/register**: Registrar usuario
- **POST /auth/login**: Login (devuelve JWT)
- **POST /auth/refresh**: Refrescar access token (acepta token expirado)

#### Users (`/users`) (JWT + RolesGuard: ADMIN/ANALYST)

- **POST /users/analysts**: Crear analista (**solo ADMIN**)
- **GET /users/:id**: Obtener usuario por id
- **GET /users/:id/roles**: Obtener roles del usuario

#### Roles (`/roles`) (JWT + RolesGuard: ADMIN/ANALYST)

- **GET /roles**: Listar roles
- **GET /roles/:id**: Obtener rol por id

### Risk Scoring (`/clients`) (JWT + RolesGuard)

- **POST /clients**: Crear perfil de cliente + evaluación inicial simulada (**solo CLIENT**)
- **POST /clients/:evaluationOutcome**: Igual, pero forzando scoring `1` (positivo) o `2` (negativo) (**solo CLIENT**)
- **GET /clients/:id**: Obtener cliente por id
- **GET /clients/:id/credit-profile**: Obtener perfil de crédito por clientId

### Credit Management

#### Credit Requests (`/credit-requests`)

- **GET /credit-requests/pending**: Bandeja de pendientes (**ANALYST/ADMIN**)
- **GET /credit-requests/my**: Mis solicitudes (**CLIENT**)
- **POST /credit-requests**: Crear solicitud (**CLIENT**)
- **GET /credit-requests/:id**: Detalle (cliente dueño o staff)
- **PATCH /credit-requests/:id/reject**: Rechazar (**ANALYST/ADMIN**)
- **PATCH /credit-requests/:id/approve**: Aprobar: crea préstamo y cronograma (**ANALYST/ADMIN**)

#### Loans (`/loans`)

- **GET /loans?clientId=...**: Listar préstamos por clientId
- **GET /loans?status=...**: Listar préstamos por status
- **GET /loans/:id**: Obtener préstamo por id
- **GET /loans/:loanId/installments**: Listar cuotas de un préstamo

#### Installments (`/installments`)

- **GET /installments/:id**: Obtener cuota por id

## Lista completa

Para el detalle completo (con notas adicionales), revisa `docs/ENDPOINTS.md`.

