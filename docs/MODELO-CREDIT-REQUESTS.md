# Modelo `credit_requests`

## Flujo

1. **Cliente** crea solicitud → `status = PENDING` (monto, plazo, destino, etc.).
2. **Evaluación**: puedes asociar `evaluation_id` a la última `credit_evaluations` del cliente al crear o al revisar.
3. **Analista**:
   - **Rechaza** → `status = REJECTED`, `rejection_reason`, `reviewed_by_user_id`, `reviewed_at`. No hay `loan_id`.
   - **Aprueba** → defines `approved_amount` / `approved_term_months` / `approved_interest_rate` / `approved_interest_type`, creas **`loans`** + **`installments`**, y guardas `loan_id` + `status = APPROVED`.

## Campos (resumen)

| Campo | Uso |
|-------|-----|
| `client_id` | Quién pide el crédito |
| `requested_amount`, `term_months`, `currency`, `purpose`, `client_notes` | Lo que pide el cliente (base para evaluar) |
| `evaluation_id` | Trazabilidad con la evaluación de riesgo usada |
| `status` | `PENDING` → `UNDER_REVIEW` (opc.) → `APPROVED` \| `REJECTED` \| `CANCELLED` |
| `reviewed_by_user_id`, `reviewed_at` | Analista y momento de decisión |
| `rejection_reason` | Si rechazó |
| `approved_*` | Condiciones finales del crédito otorgado |
| `loan_id` | Enlace al préstamo (y al cronograma en `installments`) cuando está aprobado |

## Estados

- **PENDING**: esperando decisión.
- **UNDER_REVIEW**: (opcional) en bandeja del analista.
- **APPROVED**: debe tener `loan_id`; el cronograma vive en `installments` donde `loan_id` = ese préstamo.
- **REJECTED**: sin préstamo; motivo en `rejection_reason`.
- **CANCELLED**: cliente desistió.

## Reglas de integridad (negocio)

- Si `status = APPROVED` → `loan_id` NOT NULL y existe `Loan` + cuotas.
- Si `status = REJECTED` → `loan_id` NULL; conviene `rejection_reason` NOT NULL.

La entidad TypeORM está en `src/credit-management/domain/entities/credit-request.entity.ts`.
