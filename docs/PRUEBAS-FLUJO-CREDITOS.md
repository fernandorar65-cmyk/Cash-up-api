# Pruebas manuales: flujo de solicitudes de crédito

**Base URL local:** `http://localhost:3000` (o el `PORT` que uses).

- Si ejecutas la API con prefijo global `api` (p. ej. Azure Functions / `main.azure.ts`), antepone **`/api`** a todas las rutas: `http://localhost:3000/api/auth/login`, etc.

**Auth:** casi todos los endpoints llevan header:

```http
Authorization: Bearer <access_token>
```

En los ejemplos de abajo sustituye `TOKEN_CLIENTE`, `TOKEN_ADMIN`, `TOKEN_ANALISTA` por el `access_token` que devuelve `POST /auth/login`.

---

## Orden recomendado del flujo

1. **Cliente:** registro → login → crear solicitud → ver mis solicitudes / detalle.
2. **Admin:** login → (opcional) crear analista.
3. **Analista o admin:** bandeja pendientes → detalle → **aprobar** (crea préstamo + cuotas) o **rechazar**.
4. **Ver préstamo y cuotas** con los IDs que devuelva la aprobación.

> **Nota:** El registro público solo asigna rol **cliente**. Para **aprobar/rechazar** hace falta un usuario con rol **analista** o **admin** (creado en BD, seed, o con `POST /users/analysts` usando un **admin**).

---

## 0. Variables útiles (PowerShell)

```powershell
$BASE = "http://localhost:3000"
```

---

## 1. Cliente — registro y login

### 1.1 Registrar cliente

```http
POST {{BASE}}/auth/register
Content-Type: application/json

{
  "email": "cliente.demo@example.com",
  "name": "Cliente Demo",
  "password": "secret12"
}
```

### 1.2 Login (guardar el token)

```http
POST {{BASE}}/auth/login
Content-Type: application/json

{
  "email": "cliente.demo@example.com",
  "password": "secret12"
}
```

Respuesta incluye `access_token` → úsalo como `TOKEN_CLIENTE`.

---

## 2. Cliente — solicitud de crédito

### 2.1 Crear solicitud

```http
POST {{BASE}}/credit-requests
Authorization: Bearer TOKEN_CLIENTE
Content-Type: application/json

{
  "requestedAmount": 10000,
  "termMonths": 12,
  "currency": "PEN",
  "purpose": "Personal",
  "clientNotes": "Prueba de flujo"
}
```

- **409** si ya tiene una solicitud **pendiente**.

### 2.2 Mis solicitudes

```http
GET {{BASE}}/credit-requests/my
Authorization: Bearer TOKEN_CLIENTE
```

### 2.3 Detalle de una solicitud

Sustituye `CREDIT_REQUEST_ID` por el `id` devuelto al crear o en la lista.

```http
GET {{BASE}}/credit-requests/CREDIT_REQUEST_ID
Authorization: Bearer TOKEN_CLIENTE
```

---

## 3. Admin — crear analista (opcional)

Solo rol **admin**. Primero login con tu usuario admin.

```http
POST {{BASE}}/users/analysts
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "email": "analista.demo@example.com",
  "name": "Analista Demo",
  "password": "secret12"
}
```

Luego `POST /auth/login` con ese analista → `TOKEN_ANALISTA`.

---

## 4. Analista o admin — bandeja y decisión

Usa `TOKEN_ANALISTA` o `TOKEN_ADMIN`.

### 4.1 Solicitudes pendientes

```http
GET {{BASE}}/credit-requests/pending
Authorization: Bearer TOKEN_ANALISTA
```

### 4.2 Detalle (mismo id que el cliente)

```http
GET {{BASE}}/credit-requests/CREDIT_REQUEST_ID
Authorization: Bearer TOKEN_ANALISTA
```

### 4.3 Aprobar (crea préstamo ACTIVE + cronograma de cuotas)

```http
PATCH {{BASE}}/credit-requests/CREDIT_REQUEST_ID/approve
Authorization: Bearer TOKEN_ANALISTA
Content-Type: application/json

{
  "approvedAmount": 10000,
  "approvedTermMonths": 12,
  "approvedInterestRate": 24.5,
  "approvedInterestType": "FIXED_ANNUAL",
  "firstInstallmentDueDate": "2026-04-15"
}
```

- `approvedInterestRate`: **tasa anual en %**.
- `firstInstallmentDueDate`: opcional (ISO); si no envías, el backend usa su lógica por defecto (+1 mes).
- En la respuesta deberías ver datos del **préstamo** y/o referencias para seguir el flujo.

### 4.4 Rechazar (alternativa a aprobar)

```http
PATCH {{BASE}}/credit-requests/CREDIT_REQUEST_ID/reject
Authorization: Bearer TOKEN_ANALISTA
Content-Type: application/json

{
  "rejectionReason": "Score insuficiente para el monto solicitado."
}
```

---

## 5. Préstamos y cuotas (post-aprobación)

Sustituye `LOAN_ID` por el id del préstamo que devuelva la aprobación (o consúltalo por cliente/estado).

### 5.1 Listar préstamos por cliente

```http
GET {{BASE}}/loans?clientId=UUID_DEL_CLIENTE
Authorization: Bearer TOKEN_ANALISTA
```

(Ajusta auth si en tu API estos GET exigen otro rol; revisa guards en `loans.controller`.)

### 5.2 Detalle de préstamo

```http
GET {{BASE}}/loans/LOAN_ID
```

### 5.3 Cuotas del préstamo

```http
GET {{BASE}}/loans/LOAN_ID/installments
```

### 5.4 Detalle de una cuota

```http
GET {{BASE}}/installments/INSTALLMENT_ID
```

---

## Resumen del flujo en una frase

**Cliente** crea solicitud → **Analista/Admin** ve `GET /credit-requests/pending` → **aprueba** con `PATCH .../approve` (o **rechaza**) → con la aprobación consultas **préstamo** y **cuotas** en `/loans`.

---

## Swagger

Si Swagger está configurado en el proyecto, abre la URL que indique tu `main.ts` (a veces `/api/docs` o similar).

Ahí puedes probar los mismos endpoints con el botón **Authorize** y el JWT.
