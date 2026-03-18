# Requests requeridos para Analista

Base URL: `http://localhost:4000`
Header común:
`Authorization: Bearer <ACCESS_TOKEN>`

> Roles: estos endpoints requieren **ANALYST** o **ADMIN** (según el caso).

---

## 1) Pasar solicitud a “en revisión”

### Endpoint
- **PATCH** `/credit-requests/:id/under-review`

### Params
- `:id` = `creditRequestId`

### Body
- Ninguno

### Ejemplo (curl)
```bash
curl -X PATCH "http://localhost:4000/credit-requests/<CREDIT_REQUEST_ID>/under-review" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json"
```

### Respuesta (forma general)
```json
{
  "id": "<CREDIT_REQUEST_ID>",
  "status": "UNDER_REVIEW",
  "reviewedAt": "2026-03-18T00:00:00.000Z"
}
```

### Errores comunes
- `401`: token inválido/expirado
- `403`: rol no permitido
- `404`: solicitud no encontrada
- `409`: estado no compatible para pasar a revisión

---

## 2) Ver historial crediticio del cliente

### Endpoint
- **GET** `/clients/:id/evaluations`

### Params
- `:id` = `clientId`

### Body
- Ninguno

### Permisos
- **Staff**: ANALYST / ADMIN
- **Dueño**: permitido si el cliente pertenece al usuario autenticado

### Ejemplo (curl)
```bash
curl -X GET "http://localhost:4000/clients/<CLIENT_ID>/evaluations" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Respuesta (forma general)
```json
[
  {
    "id": "<EVALUATION_ID>",
    "clientId": "<CLIENT_ID>",
    "score": 85.5,
    "approved": true,
    "factors": { "...": "..." },
    "evaluatedAt": "2026-03-18T00:00:00.000Z"
  }
]
```

### Errores comunes
- `401`: token inválido/expirado
- `403`: no estás autorizado para ver ese cliente
- `404`: cliente no encontrado

