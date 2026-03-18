# Mobile App (mínimo) — Vistas y endpoints

Objetivo: la app mobile solo debe permitir **login**, **solicitar un crédito**, **ver mis créditos** y **ver el cronograma (cuotas)**.

Base URL (local): `http://localhost:4000`

Swagger: `GET /docs`

> Auth: enviar `Authorization: Bearer <access_token>` en endpoints protegidos.

## 1) Autenticación

### 1.1 Login
- **Pantalla**: `Login`
- **Endpoint**:
  - **POST** `/auth/login`
    - Body: `{ "email": string, "password": string }`
    - Response: `{ "access_token": string, "user": { id, email, name } }`
- **Guardar**: `access_token` (secure storage).

### 1.2 Refresh (si el token expira)
- **Uso**: handler/interceptor cuando recibas 401 o antes de acciones críticas.
- **Endpoint**:
  - **POST** `/auth/refresh`
    - Body: `{ "access_token": "<token-anterior>" }` (acepta expirado)
    - Response: `{ "access_token": "<token-nuevo>" }`

## 2) Solicitar crédito

### 2.1 Nueva solicitud
- **Pantalla**: `NuevaSolicitud`
- **Endpoint**:
  - **POST** `/credit-requests`
    - Body: `{ "requestedAmount": number, "termMonths": number, "currency"?: "PEN"|"USD", "purpose"?: string|null, "clientNotes"?: string|null }`
    - Response: detalle básico de la solicitud creada

### 2.2 Mis solicitudes (opcional para UX)
- **Pantalla**: `MisSolicitudes` (solo si quieres mostrar estado PENDING/UNDER_REVIEW)
- **Endpoint**:
  - **GET** `/credit-requests/my`

## 3) Mis créditos (préstamos)

### 3.1 Lista de mis préstamos
- **Pantalla**: `MisCreditos`
- **Endpoint**:
  - **GET** `/loans/my`
    - Response: lista de préstamos del cliente autenticado

### 3.2 Detalle de préstamo
- **Pantalla**: `CreditoDetalle`
- **Endpoint**:
  - **GET** `/loans/:id`

## 4) Cronograma (cuotas)

### 4.1 Cronograma por préstamo
- **Pantalla**: `Cronograma`
- **Endpoint**:
  - **GET** `/loans/:loanId/installments`
    - Response: cuotas ordenadas por número

## 5) Flujo recomendado (simple)

1. `Login` → guardar token
2. `MisCreditos` (GET `/loans/my`)
   - Si no tiene préstamos y quiere solicitar → `NuevaSolicitud`
3. `NuevaSolicitud` (POST `/credit-requests`)
4. Cuando el préstamo esté aprobado (lo hace staff) aparecerá en `MisCreditos`
5. `CreditoDetalle` → `Cronograma` (GET `/loans/:loanId/installments`)

