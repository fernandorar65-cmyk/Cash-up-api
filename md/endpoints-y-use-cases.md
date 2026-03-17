# Endpoints y use cases implementados

Resumen de la capa de **presentación** (controllers) y **aplicación** (use cases) añadida a cada bounded context. Todos los endpoints están bajo el prefijo **`/api`** (configurado en `main.azure.ts`).

---

## 1. IAM / Users

**Base path:** `/api/users` y `/api/roles`

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users/:id` | Obtener usuario por ID |
| GET | `/api/users/:id/roles` | Listar roles asignados a un usuario |
| GET | `/api/roles` | Listar todos los roles |
| GET | `/api/roles/:id` | Obtener rol por ID |

### Use cases

- **GetUserUseCase** – Obtiene un usuario por ID (404 si no existe).
- **GetUserRolesUseCase** – Lista los UserRole de un usuario.
- **GetRoleUseCase** – Obtiene un rol por ID (404 si no existe).
- **ListRolesUseCase** – Lista todos los roles.

### Controllers

- **UsersController** – Rutas bajo `users`.
- **RolesController** – Rutas bajo `roles`.

---

## 2. Credit Management

**Base path:** `/api/loans` y `/api/installments`

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/loans` | Listar préstamos (query: `?clientId=`, `?status=`) |
| GET | `/api/loans/:loanId/installments` | Cuotas de un préstamo |
| GET | `/api/loans/:id` | Obtener préstamo por ID |
| GET | `/api/installments/:id` | Obtener cuota por ID |

### Use cases

- **GetLoanUseCase** – Préstamo por ID (404 si no existe).
- **ListLoansByClientUseCase** – Préstamos por `clientId`.
- **ListLoansByStatusUseCase** – Préstamos por estado.
- **GetInstallmentUseCase** – Cuota por ID (404 si no existe).
- **ListInstallmentsByLoanUseCase** – Cuotas de un préstamo.

### Controllers

- **LoansController** – Rutas bajo `loans`.
- **InstallmentsController** – Rutas bajo `installments`.

---

## 3. Payments

**Base path:** `/api/payments` y `/api/loans` (solo pagos)

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/payments/:id` | Obtener pago por ID |
| GET | `/api/payments/:id/applications` | Aplicaciones (distribución) de un pago |
| GET | `/api/loans/:loanId/payments` | Pagos de un préstamo |

### Use cases

- **GetPaymentUseCase** – Pago por ID (404 si no existe).
- **ListPaymentsByLoanUseCase** – Pagos por `loanId`.
- **ListPaymentApplicationsUseCase** – Aplicaciones de un pago.

### Controllers

- **PaymentsController** – Rutas bajo `payments`.
- **LoansPaymentsController** – Ruta bajo `loans/:loanId/payments`.

---

## 4. Risk & Scoring

**Base path:** `/api/clients`

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/clients/:id/credit-profile` | Perfil de crédito del cliente |
| GET | `/api/clients/:id` | Obtener cliente por ID |

### Use cases

- **GetClientUseCase** – Cliente por ID (404 si no existe).
- **GetClientCreditProfileUseCase** – Perfil de crédito del cliente (404 si no existe).

### Controllers

- **ClientsController** – Rutas bajo `clients`.

---

## 5. Collection / Debt Recovery

**Base path:** `/api/collection-actions`

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/collection-actions/by-client/:clientId` | Gestiones de cobranza por cliente |
| GET | `/api/collection-actions/by-loan/:loanId` | Gestiones de cobranza por préstamo |
| GET | `/api/collection-actions/:id` | Obtener gestión por ID |

### Use cases

- **GetCollectionActionUseCase** – Gestión por ID (404 si no existe).
- **ListCollectionActionsByClientUseCase** – Por `clientId`.
- **ListCollectionActionsByLoanUseCase** – Por `loanId`.

### Controllers

- **CollectionActionsController** – Rutas bajo `collection-actions`.

---

## 6. Audit

**Base path:** `/api/audit-logs`

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/audit-logs/entity/:entityType/:entityId` | Logs por tipo e ID de entidad |
| GET | `/api/audit-logs/:id` | Obtener log de auditoría por ID |

### Use cases

- **GetAuditLogUseCase** – Log por ID (404 si no existe).
- **ListAuditLogsByEntityUseCase** – Logs por `entityType` y `entityId`.

### Controllers

- **AuditLogsController** – Rutas bajo `audit-logs`.

---

## Flujo de una petición

1. **HTTP** → Controller (presentación).
2. **Controller** → llama a un **use case** (`execute(...)`).
3. **Use case** → inyecta el **repositorio** (port) y llama a `findById`, `findByXxx`, etc.
4. **Repositorio** → por ahora es stub (devuelve `null` o `[]`). Más adelante será persistencia real.

Cuando el repositorio devuelve `null`, el use case lanza **NotFoundException** (404).

---

## Resumen de archivos añadidos

| Contexto | Use cases | Controllers |
|----------|-----------|-------------|
| IAM | 4 | 2 (Users, Roles) |
| Credit Management | 5 | 2 (Loans, Installments) |
| Payments | 3 | 2 (Payments, LoansPayments) |
| Risk & Scoring | 2 | 1 (Clients) |
| Collection | 3 | 1 (CollectionActions) |
| Audit | 2 | 1 (AuditLogs) |
| **Total** | **19** | **9** |

---

## Cómo probar

Con la API en marcha (local con `npm run start` o Azure con `npm run start:azure`):

- Base URL: `http://localhost:3000/api` (Express) o `http://localhost:7071/api` (Azure Functions).
- Ejemplos:
  - `GET /api/roles` → lista roles (hoy `[]`).
  - `GET /api/users/cualquier-id` → 404 (repositorio stub devuelve null).
  - `GET /api/loans?clientId=xxx` → `[]`.

Los repositorios siguen siendo stub; al conectar base de datos, los mismos endpoints devolverán datos reales sin cambiar controllers ni use cases.
