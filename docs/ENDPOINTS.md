# Endpoints disponibles (Cash Up API)

Base URL local: `http://localhost:4000`

Swagger UI: `GET /docs`

## Salud / prueba

- **GET /**: Público (`AppController.getHello`)
- **GET /mensaje1**: Público
- **GET /mensaje2**: Público

## IAM

### Auth (`/auth`) (público)

- **POST /auth/register**: Registrar usuario (rol CLIENT por defecto si existe)
- **POST /auth/login**: Login (JWT)

### Users (`/users`) (requiere JWT + RolesGuard)

Requiere rol **ADMIN** o **ANALYST** en el controller.

- **POST /users/analysts**: Solo **ADMIN** (crear analista)
- **GET /users/:id**: Obtener usuario por id
- **GET /users/:id/roles**: Obtener roles del usuario

### Roles (`/roles`) (requiere JWT + RolesGuard)

Requiere rol **ADMIN** o **ANALYST**.

- **GET /roles**: Listar roles
- **GET /roles/:id**: Obtener rol por id

## Risk Scoring (`/clients`) (requiere JWT + RolesGuard)

Requiere rol **CLIENT** para crear perfil.

- **POST /clients**: Crear perfil de cliente + evaluación inicial simulada
- **POST /clients/:evaluationOutcome**: Crear perfil + evaluación simulada forzada
  - `evaluationOutcome=1` (positivo) o `2` (negativo)
- **GET /clients/:id**: Obtener cliente por id
- **GET /clients/:id/credit-profile**: Obtener perfil de crédito por clientId

## Credit Management

### Credit Requests (`/credit-requests`)

- **GET /credit-requests/pending**: Requiere rol **ANALYST** o **ADMIN**
- **GET /credit-requests/my**: Requiere rol **CLIENT**
- **POST /credit-requests**: Requiere rol **CLIENT** (crear solicitud)
- **GET /credit-requests/:id**: Requiere JWT (el caso de uso valida dueño o staff)
- **PATCH /credit-requests/:id/reject**: Requiere rol **ANALYST** o **ADMIN**
- **PATCH /credit-requests/:id/approve**: Requiere rol **ANALYST** o **ADMIN**

### Loans (`/loans`)

- **GET /loans?clientId=...**: Listar préstamos por clientId
- **GET /loans?status=...**: Listar préstamos por status
- **GET /loans/:id**: Obtener préstamo por id
- **GET /loans/:loanId/installments**: Listar cuotas de un préstamo

### Installments (`/installments`)

- **GET /installments/:id**: Obtener cuota por id

# Endpoints actuales (`cash-up-api`)

## Base URL

- **Local (Nest)**: `http://localhost:3000`
- **Azure Functions (prefijo global)**: `http://localhost:7071/api` *(porque `main.azure.ts` setea `app.setGlobalPrefix('api')`)*

> Si estás usando Azure Functions como “proxy” con un solo endpoint (por ejemplo `function1`), entonces **todas** las rutas reales de Nest quedan detrás de ese endpoint. En local con `nest start` usas las rutas directas.

---

## Autenticación y roles

- **JWT Bearer** (global): la API usa `JwtAuthGuard` como guard global, así que **todo requiere token** excepto endpoints marcados con `@Public()`.
- **Header**:

```http
Authorization: Bearer <access_token>
```

- **Roles** (cuando aplica): `admin`, `analyst`, `client` (ver `RoleName`).

---

## Health / demo (público)

### `GET /`
- **Auth**: Público
- **Descripción**: Hello básico

### `GET /mensaje1`
- **Auth**: Público
- **Descripción**: Mensaje demo

### `GET /mensaje2`
- **Auth**: Público
- **Descripción**: Mensaje demo 2

---

## Auth (público)

### `POST /auth/register`
- **Auth**: Público
- **Body**:

```json
{
  "email": "cliente.demo@example.com",
  "name": "Cliente Demo",
  "password": "secret12"
}
```

- **Respuesta (shape)**: `{ id, email, name }`

### `POST /auth/login`
- **Auth**: Público
- **Body**:

```json
{
  "email": "cliente.demo@example.com",
  "password": "secret12"
}
```

- **Respuesta (shape)**:

```json
{
  "access_token": "JWT",
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string"
  }
}
```

---

## Users (requiere JWT + roles)

Base: `/users`

> El controller está protegido por `@Roles(admin, analyst)` a nivel clase, con overrides por endpoint.

### `POST /users/analysts`
- **Auth**: JWT
- **Roles**: `admin`
- **Body**:

```json
{
  "email": "analista.demo@example.com",
  "name": "Analista Demo",
  "password": "secret12"
}
```

### `GET /users/:id`
- **Auth**: JWT
- **Roles**: `admin` o `analyst`

### `GET /users/:id/roles`
- **Auth**: JWT
- **Roles**: `admin` o `analyst`

---

## Roles (requiere JWT + roles)

Base: `/roles`

### `GET /roles`
- **Auth**: JWT
- **Roles**: `admin` o `analyst`

### `GET /roles/:id`
- **Auth**: JWT
- **Roles**: `admin` o `analyst`

---

## Clients (Risk Scoring) (requiere JWT + rol)

Base: `/clients`

### `POST /clients`
- **Auth**: JWT
- **Roles**: `client`
- **Descripción**: Crea perfil de cliente y genera evaluación inicial simulada
- **Body**: `CreateClientDto` (ver `src/risk-scoring/presentation/dto/create-client.dto.ts`)

### `POST /clients/:evaluationOutcome`
- **Auth**: JWT
- **Roles**: `client`
- **Params**: `evaluationOutcome` ∈ `{ "1", "2" }`
- **Descripción**: Igual que crear cliente, pero fuerza resultado de evaluación (1=positivo, 2=negativo)
- **Body**: `CreateClientDto`

### `GET /clients/:id`
- **Auth**: JWT *(no hay RolesGuard en el controller; depende de tu guard global)*
- **Descripción**: Obtiene cliente por id

### `GET /clients/:id/credit-profile`
- **Auth**: JWT *(igual que arriba)*
- **Descripción**: Obtiene perfil de crédito del cliente

---

## Credit Requests (requiere JWT + roles según endpoint)

Base: `/credit-requests`

### `GET /credit-requests/pending`
- **Auth**: JWT
- **Roles**: `analyst` o `admin`
- **Descripción**: Bandeja de solicitudes pendientes

### `GET /credit-requests/my`
- **Auth**: JWT
- **Roles**: `client`
- **Descripción**: Mis solicitudes

### `POST /credit-requests`
- **Auth**: JWT
- **Roles**: `client`
- **Body**:

```json
{
  "requestedAmount": 10000,
  "termMonths": 12,
  "currency": "PEN",
  "purpose": "Personal",
  "clientNotes": "Prueba"
}
```

### `GET /credit-requests/:id`
- **Auth**: JWT
- **Descripción**: Detalle (cliente dueño o analista/admin, según lógica del use-case)

### `PATCH /credit-requests/:id/reject`
- **Auth**: JWT
- **Roles**: `analyst` o `admin`
- **Body**:

```json
{
  "rejectionReason": "Motivo..."
}
```

### `PATCH /credit-requests/:id/approve`
- **Auth**: JWT
- **Roles**: `analyst` o `admin`
- **Body**:

```json
{
  "approvedAmount": 10000,
  "approvedTermMonths": 12,
  "approvedInterestRate": 24.5,
  "approvedInterestType": "FIXED_ANNUAL",
  "firstInstallmentDueDate": "2026-04-15"
}
```

---

## Loans (requiere JWT)

Base: `/loans`

### `GET /loans?clientId=<uuid>`
- **Auth**: JWT
- **Descripción**: Lista préstamos por cliente

### `GET /loans?status=<string>`
- **Auth**: JWT
- **Descripción**: Lista préstamos por estado

### `GET /loans/:id`
- **Auth**: JWT
- **Descripción**: Detalle de préstamo

### `GET /loans/:loanId/installments`
- **Auth**: JWT
- **Descripción**: Lista cuotas de un préstamo

---

## Installments (requiere JWT)

Base: `/installments`

### `GET /installments/:id`
- **Auth**: JWT
- **Descripción**: Detalle de cuota

---

## Payments (requiere JWT)

Base: `/payments`

### `GET /payments/:id`
- **Auth**: JWT
- **Descripción**: Detalle de pago

### `GET /payments/:id/applications`
- **Auth**: JWT
- **Descripción**: Aplicaciones del pago (a qué cuotas/cargos se aplicó)

---

## Loan Payments (requiere JWT)

Base: `/loans`

### `GET /loans/:loanId/payments`
- **Auth**: JWT
- **Descripción**: Lista pagos de un préstamo

---

## Collection Actions (requiere JWT)

Base: `/collection-actions`

### `GET /collection-actions/by-client/:clientId`
- **Auth**: JWT
- **Descripción**: Acciones de cobranza por cliente

### `GET /collection-actions/by-loan/:loanId`
- **Auth**: JWT
- **Descripción**: Acciones de cobranza por préstamo

### `GET /collection-actions/:id`
- **Auth**: JWT
- **Descripción**: Detalle de acción de cobranza

---

## Audit Logs (requiere JWT)

Base: `/audit-logs`

### `GET /audit-logs/entity/:entityType/:entityId`
- **Auth**: JWT
- **Descripción**: Logs por entidad (tipo + id)

### `GET /audit-logs/:id`
- **Auth**: JWT
- **Descripción**: Detalle de log

