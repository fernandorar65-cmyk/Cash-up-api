# Frontend (propuesta) — Vistas y endpoints a consumir

Base URL (local): `http://localhost:4000`

Swagger: `GET /docs`

> Autenticación: usa `Authorization: Bearer <access_token>` en endpoints protegidos.

## 1) Vistas comunes (no dependen de rol)

### 1.1 Login
- **Vista**: `/login`
- **Acción**: iniciar sesión
- **Endpoint**:
  - **POST** `/auth/login`
    - Body: `{ "email": string, "password": string }`
    - Response: `{ "access_token": string, "user": { id, email, name } }`

### 1.2 Registro
- **Vista**: `/register`
- **Acción**: crear cuenta
- **Endpoint**:
  - **POST** `/auth/register`
    - Body: `{ "email": string, "name": string, "password": string }`
    - Response: `{ id, email, name }`

### 1.3 Refresh token (renovar access token)
- **Uso**: interceptor/handler cuando el token expira o antes de llamadas críticas
- **Endpoint**:
  - **POST** `/auth/refresh`
    - Body: `{ "access_token": "<token-anterior>" }` (acepta expirado)
    - Response: `{ "access_token": "<token-nuevo>" }`

## 2) Vistas CLIENT (cliente final)

### 2.1 Home / “Estado de mi crédito”
- **Vista**: `/client/home`
- **Objetivo**: mostrar “mi perfil”, score actual, solicitudes y préstamos
- **Endpoints (en paralelo)**:
  - **GET** `/clients/me` (mi perfil)
  - **GET** `/credit-requests/my` (mis solicitudes)
  - **GET** `/loans/my` (mis préstamos)
  - **GET** `/installments/my?status=PENDING` (mis cuotas pendientes)

### 2.2 Perfil de cliente (ver/editar)
- **Vista**: `/client/profile`
- **Objetivo**: ver y actualizar datos del cliente (nombre/email/teléfono/ingreso)
- **Endpoints**:
  - **GET** `/clients/me` (cargar datos)
  - **PATCH** `/clients/me` (guardar cambios)
    - Body (parcial): `{ name?, email?, phone?, monthlyIncome? }`

### 2.3 Crear perfil de cliente (onboarding)
- **Vista**: `/client/onboarding`
- **Objetivo**: completar perfil y generar evaluación inicial
- **Endpoints**:
  - **POST** `/clients` (evaluación inicial aleatoria)
    - Body: `{ documentType, documentNumber, name, email?, phone?, monthlyIncome }`
  - (opcional QA) **POST** `/clients/1` o `/clients/2` (forzar outcome)

### 2.4 Nueva solicitud de crédito
- **Vista**: `/client/credit-requests/new`
- **Objetivo**: crear una solicitud
- **Endpoint**:
  - **POST** `/credit-requests`
    - Body: `{ requestedAmount, termMonths, currency?, purpose?, clientNotes? }`

### 2.5 Mis solicitudes (lista)
- **Vista**: `/client/credit-requests`
- **Endpoint**:
  - **GET** `/credit-requests/my`

### 2.6 Detalle de solicitud
- **Vista**: `/client/credit-requests/:id`
- **Endpoint**:
  - **GET** `/credit-requests/:id`

### 2.7 Cancelar solicitud
- **Vista**: acción/botón dentro del detalle o lista
- **Endpoint**:
  - **PATCH** `/credit-requests/:id/cancel`

### 2.8 Mis préstamos (lista)
- **Vista**: `/client/loans`
- **Endpoint**:
  - **GET** `/loans/my`

### 2.9 Detalle de préstamo + cronograma
- **Vista**: `/client/loans/:loanId`
- **Endpoints**:
  - **GET** `/loans/:loanId`
  - **GET** `/loans/:loanId/installments`

### 2.10 Mis cuotas (lista + filtros)
- **Vista**: `/client/installments`
- **Endpoints**:
  - **GET** `/installments/my` (todas)
  - **GET** `/installments/my?status=PENDING`
  - **GET** `/installments/my?status=PAID`
  - **GET** `/installments/my?status=OVERDUE`

## 3) Vistas ANALYST/ADMIN (staff)

### 3.1 Bandeja de solicitudes (pendientes / en revisión)
- **Vista**: `/staff/credit-requests/inbox`
- **Endpoints**:
  - **GET** `/credit-requests/pending`
  - (más completo) **GET** `/credit-requests?status=PENDING`
  - (más completo) **GET** `/credit-requests?status=UNDER_REVIEW`

### 3.2 Listado de solicitudes con filtros (panel)
- **Vista**: `/staff/credit-requests`
- **Endpoint**:
  - **GET** `/credit-requests?status=...&clientId=...&from=...&to=...`
    - `status`: `PENDING|UNDER_REVIEW|APPROVED|REJECTED|CANCELLED`
    - `from/to`: ISO date (ej. `2026-03-01`)

### 3.3 Detalle de solicitud (staff)
- **Vista**: `/staff/credit-requests/:id`
- **Endpoint**:
  - **GET** `/credit-requests/:id`

### 3.4 Marcar “en revisión”
- **Vista**: acción/botón en detalle o lista
- **Endpoint**:
  - **PATCH** `/credit-requests/:id/under-review`

### 3.5 Rechazar solicitud
- **Vista**: modal “Motivo de rechazo”
- **Endpoint**:
  - **PATCH** `/credit-requests/:id/reject`
    - Body: `{ "rejectionReason": string }`

### 3.6 Aprobar solicitud (crear préstamo + cuotas)
- **Vista**: formulario de aprobación (monto, plazo, tasa, tipo interés, primera cuota opcional)
- **Endpoint**:
  - **PATCH** `/credit-requests/:id/approve`
    - Body: `{ approvedAmount, approvedTermMonths, approvedInterestRate, approvedInterestType, firstInstallmentDueDate? }`

### 3.7 Ver préstamos por cliente o status
- **Vista**: `/staff/loans`
- **Endpoint**:
  - **GET** `/loans?clientId=<uuid>`
  - **GET** `/loans?status=ACTIVE` (u otros estados si existieran)

### 3.8 Detalle préstamo + cuotas (staff)
- **Vista**: `/staff/loans/:loanId`
- **Endpoints**:
  - **GET** `/loans/:loanId`
  - **GET** `/loans/:loanId/installments`

### 3.9 Re-evaluar cliente (staff)
- **Vista**: `/staff/clients/:clientId/evaluations` (historial) + botón “Re-evaluar”
- **Endpoints**:
  - **GET** `/clients/:id/evaluations`
  - **POST** `/clients/:id/evaluations`
    - Body opcional: `{ "evaluationOutcome": 1 | 2 }`

## 4) Vistas ADMIN (gestión)

### 4.1 Crear analista
- **Vista**: `/admin/analysts/new`
- **Endpoint**:
  - **POST** `/users/analysts`
    - Body: `{ "email": string, "name": string, "password": string }`

### 4.2 Roles (listado/detalle)
- **Vista**: `/admin/roles`
- **Endpoints**:
  - **GET** `/roles`
  - **GET** `/roles/:id`

## 5) Notas de UX / flujo mínimo recomendado

- **Primer login como CLIENT**:
  - si `GET /clients/me` devuelve 404 → redirigir a `/client/onboarding`.
- **Vista Home CLIENT**:
  - mostrar CTA “Nueva solicitud” si no hay pendiente/en revisión.
- **Staff**:
  - en bandeja, primero `PATCH under-review`, luego `approve` o `reject`.

