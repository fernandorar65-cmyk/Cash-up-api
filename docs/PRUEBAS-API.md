# Pruebas de API (Cash-Up)

Base URL por defecto: **`http://localhost:3000`** (o el puerto que definas en `PORT`).

Requisitos: API levantada (`npm run start:dev`), Postgres en marcha.

---

## 1. Registro (público)

Crea un usuario con rol **client** (el que puede crear perfil de cliente).

```http
POST /auth/register
Content-Type: application/json
```

**Body:**

```json
{
  "email": "cliente1@ejemplo.com",
  "name": "María García",
  "password": "secreto123"
}
```

### cURL

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"cliente1@ejemplo.com\",\"name\":\"María García\",\"password\":\"secreto123\"}"
```

### PowerShell

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/register" `
  -ContentType "application/json" `
  -Body '{"email":"cliente1@ejemplo.com","name":"María García","password":"secreto123"}'
```

**Respuesta esperada:** `{ "id": "...", "email": "...", "name": "..." }`

---

## 2. Login (público)

```http
POST /auth/login
Content-Type: application/json
```

**Body:**

```json
{
  "email": "cliente1@ejemplo.com",
  "password": "secreto123"
}
```

### cURL

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"cliente1@ejemplo.com\",\"password\":\"secreto123\"}"
```

Guarda el **`access_token`** de la respuesta. Todas las rutas protegidas lo necesitan.

**Respuesta esperada:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

### Variable de entorno (bash)

```bash
export TOKEN="pega_aqui_el_access_token"
```

### PowerShell

```powershell
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/login" `
  -ContentType "application/json" `
  -Body '{"email":"cliente1@ejemplo.com","password":"secreto123"}'
$TOKEN = $login.access_token
```

---

## 3. Crear perfil de cliente + evaluación simulada (rol **client**)

Requiere header:

```http
Authorization: Bearer <access_token>
```

### 3.1 Evaluación **aleatoria** (positiva o negativa al azar)

```http
POST /clients
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**

```json
{
  "documentType": "DNI",
  "documentNumber": "87654321",
  "name": "María García",
  "email": "cliente1@ejemplo.com",
  "phone": "+51999888777",
  "monthlyIncome": 4500
}
```

### cURL

```bash
curl -s -X POST http://localhost:3000/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "documentType": "DNI",
    "documentNumber": "87654321",
    "name": "María García",
    "email": "cliente1@ejemplo.com",
    "phone": "+51999888777",
    "monthlyIncome": 4500
  }'
```

### PowerShell

```powershell
$headers = @{ Authorization = "Bearer $TOKEN" }
$body = @{
  documentType = "DNI"
  documentNumber = "87654321"
  name = "María García"
  email = "cliente1@ejemplo.com"
  phone = "+51999888777"
  monthlyIncome = 4500
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:3000/clients" `
  -Headers $headers -ContentType "application/json; charset=utf-8" -Body $body
```

**Respuesta:** datos del cliente + objeto **`evaluation`** (`evaluationId`, `score`, `approved`, `riskLevel`, `factors`, …).

**Errores frecuentes:**

| Código | Motivo |
|--------|--------|
| 401 | Token ausente o inválido |
| 403 | Usuario sin rol **client** |
| 409 | Ya existe perfil para ese usuario o documento duplicado |

---

### 3.2 Scoring **forzado positivo** (aprobado simulado)

Misma URL y body, pero:

```http
POST /clients/1
```

### cURL

```bash
curl -s -X POST http://localhost:3000/clients/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"documentType":"DNI","documentNumber":"11111222","name":"Test Positivo","monthlyIncome":5000}'
```

---

### 3.3 Scoring **forzado negativo** (rechazado simulado)

```http
POST /clients/2
```

### cURL

```bash
curl -s -X POST http://localhost:3000/clients/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"documentType":"DNI","documentNumber":"33333444","name":"Test Negativo","monthlyIncome":3000}'
```

**Nota:** Cada prueba necesita un **email de usuario distinto** en registro/login (un usuario = un cliente) **o** un **documentNumber** distinto si pruebas con otro usuario.

---

## 4. Consultar cliente y perfil de crédito (JWT)

Cualquier usuario autenticado puede llamar (según tu guard global). Sustituye `<CLIENT_ID>` por el `id` devuelto al crear el cliente.

```http
GET /clients/<CLIENT_ID>
Authorization: Bearer <token>
```

```http
GET /clients/<CLIENT_ID>/credit-profile
Authorization: Bearer <token>
```

### cURL

```bash
curl -s "http://localhost:3000/clients/$CLIENT_ID" \
  -H "Authorization: Bearer $TOKEN"

curl -s "http://localhost:3000/clients/$CLIENT_ID/credit-profile" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 5. Solicitudes de préstamo (`credit-requests`)

**Cliente** (después de tener perfil + evaluación inicial):

```http
POST /credit-requests
Authorization: Bearer <token_cliente>
Content-Type: application/json
```

```json
{
  "requestedAmount": 8000,
  "termMonths": 12,
  "currency": "PEN",
  "purpose": "Personal",
  "clientNotes": "Opcional"
}
```

- **GET `/credit-requests/my`** — lista tus solicitudes (rol `client`).
- **GET `/credit-requests/:id`** — detalle (dueño o analista/admin).

**Analista o admin** (token de usuario con rol `analyst` o `admin`):

- **GET `/credit-requests/pending`** — bandeja pendientes.
- **PATCH `/credit-requests/:id/reject`** — body `{ "rejectionReason": "..." }`.
- **PATCH `/credit-requests/:id/approve`** — crea `Loan` + cuotas:

```json
{
  "approvedAmount": 8000,
  "approvedTermMonths": 12,
  "approvedInterestRate": 24.5,
  "approvedInterestType": "FIXED_ANNUAL",
  "firstInstallmentDueDate": "2025-05-01"
}
```

(`firstInstallmentDueDate` es opcional; por defecto ~+1 mes.)

Luego el cronograma está en **GET `/loans/:loanId/installments`**.

---

## 6. Flujo rápido de prueba (orden)

1. `POST /auth/register` → cliente  
2. `POST /auth/login` (cliente) → token  
3. `POST /clients` (o `/1` / `/2`) → perfil + evaluación  
4. `POST /credit-requests` → solicitud  
5. Con usuario **analista** (creado por admin con `POST /users/analysts`): login → `GET /credit-requests/pending` → `PATCH .../approve` o `.../reject`

---

## 7. Swagger / Postman

En este repo **Swagger no está activado en `main.ts` por defecto**; puedes usar **Postman**, **Insomnia** o **Thunder Client** replicando las mismas URLs, método, JSON y header `Authorization: Bearer <token>`.

Si más adelante añades `@nestjs/swagger`, podrás documentar y probar desde el navegador con “Authorize”.

---

## Referencia rápida

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Registro |
| POST | `/auth/login` | No | Login → `access_token` |
| POST | `/clients` | Bearer + rol client | Cliente + evaluación aleatoria |
| POST | `/clients/1` | Bearer + rol client | Cliente + evaluación positiva simulada |
| POST | `/clients/2` | Bearer + rol client | Cliente + evaluación negativa simulada |
| GET | `/clients/:id` | Bearer | Detalle cliente |
| GET | `/clients/:id/credit-profile` | Bearer | Perfil de crédito |
| POST | `/credit-requests` | Bearer + client | Nueva solicitud |
| GET | `/credit-requests/my` | Bearer + client | Mis solicitudes |
| GET | `/credit-requests/pending` | Bearer + analyst/admin | Bandeja |
| GET | `/credit-requests/:id` | Bearer | Detalle (dueño o staff) |
| PATCH | `/credit-requests/:id/reject` | Bearer + analyst/admin | Rechazar |
| PATCH | `/credit-requests/:id/approve` | Bearer + analyst/admin | Aprobar → préstamo + cuotas |

Campos obligatorios del body de **POST /clients**: `documentType`, `documentNumber`, `name`, `monthlyIncome`.  
`email` y `phone` son opcionales.
