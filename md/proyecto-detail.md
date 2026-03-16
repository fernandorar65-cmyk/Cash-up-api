# Contexto del proyecto – Bounded Contexts, entidades y funcionalidades

Documento de referencia: **Bounded Contexts** del sistema CashUp, con **tablas/entidades** y **funcionalidades** que abarca cada uno.

---

## 1. IAM / Users

**Propósito:** Autenticación, usuarios del sistema (staff) y perfiles.

| Tabla       | Entidad   | Descripción |
|------------|-----------|-------------|
| `users`    | User      | Usuarios (administradores, analistas, cobradores). |
| `roles`    | Role      | Perfiles que definen permisos. |
| `user_roles` | UserRole | Asignación usuario–rol (N:N). |

**Funcionalidades que abarca:**
- Registro de usuarios (staff).
- Login y generación de token (JWT).
- Renovación de token (refresh) y logout.
- Consulta del perfil del usuario autenticado (GET /me).
- Actualización de perfil (nombre, etc.).
- Eliminación o desactivación de cuenta.
- Asignación y gestión de roles por usuario.
- Auditoría de acciones del usuario (uso de `audit_logs` para login, cambios de perfil, etc.).

---

## 2. Credit Management

**Propósito:** Préstamos, condiciones financieras, cuotas, refinanciamiento, cargos y mora.

| Tabla             | Entidad      | Descripción |
|-------------------|--------------|-------------|
| `loans`           | Loan         | Préstamos (monto, tasa, plazo, tipo de interés, estado). |
| `loan_refinances` | LoanRefinance| Vinculación préstamo original → nuevo. |
| `installments`    | Installment  | Cuotas del cronograma (obligación periódica). |
| `loan_charges`    | LoanCharge   | Cargos adicionales (comisiones, seguros, gastos). |
| `penalty_policies`| PenaltyPolicy| Reglas de mora (porcentaje, días de gracia, tipo de cálculo). |
| `late_fees`       | LateFee      | Penalidades por atraso en cuotas. |
| `loan_history`    | LoanHistory  | Historial de cambios del préstamo (estado, condiciones). |

**Funcionalidades que abarca:**
- Simulación de crédito (cuota, total a pagar, cronograma sin guardar).
- Crear préstamo (pendiente de aprobación).
- Listar préstamos por cliente y/o estado.
- Ver detalle de un préstamo y su cronograma de cuotas.
- Aprobar o rechazar préstamo.
- Desembolsar préstamo aprobado (generar cuotas y marcar como activo).
- Refinanciar: vincular préstamo original con uno nuevo sin perder historial.
- Aplicar cargos al préstamo (comisión, seguro, gasto administrativo).
- Definir y usar políticas de mora (cálculo de penalidades).
- Registrar mora generada por cuota (late_fees).
- Mantener historial de cambios del préstamo (loan_history).

---

## 3. Payments

**Propósito:** Dinero recibido y su distribución en cuotas.

| Tabla                 | Entidad          | Descripción |
|-----------------------|-------------------|-------------|
| `payments`            | Payment           | Pagos realizados (monto, método, referencia, fecha). |
| `payment_applications`| PaymentApplication| Distribución del pago en principal, interés y mora por cuota(s). |

**Funcionalidades que abarca:**
- Registrar un pago (monto, método, referencia, cliente, préstamo).
- Distribuir el pago entre una o varias cuotas (payment_applications).
- Aplicar el pago a principal, interés y mora según reglas del negocio.
- Pagos parciales (varias cuotas o una parte de la cuota).
- Pagos adelantados.
- Listar pagos por préstamo o por cliente.
- Consultar detalle de un pago y sus aplicaciones.

---

## 4. Risk & Scoring

**Propósito:** Clientes, evaluación de riesgo, puntaje y antecedentes.

| Tabla                    | Entidad             | Descripción |
|---------------------------|---------------------|-------------|
| `clients`                 | Client              | Datos del cliente (documento, ingresos, contacto). |
| `credit_evaluations`      | CreditEvaluation    | Evaluación de riesgo (puntaje, aprobado/rechazado, factores). |
| `credit_score_history`    | CreditScoreHistory  | Historial del puntaje del cliente en el tiempo. |
| `client_background_checks`| ClientBackgroundCheck| Verificaciones externas (judicial, listas de riesgo, validaciones). |
| `external_debts`         | ExternalDebt        | Deudas externas para nivel de endeudamiento. |
| `client_credit_profiles`  | ClientCreditProfile | Perfil actual: puntaje, nivel de riesgo, deuda, pagos a tiempo/atrasados. |

**Funcionalidades que abarca:**
- Alta y actualización de clientes (solicitantes de préstamos).
- Consulta de perfil de scoring de un cliente (puntaje actual, perfil).
- Recalcular puntaje (scoring) según ingresos, deuda, historial de pagos.
- Evaluar riesgo antes de un préstamo (aprobar/rechazar, factores).
- Registrar verificaciones de antecedentes (judiciales, listas de riesgo).
- Registrar deudas externas del cliente.
- Mantener historial de puntaje (credit_score_history) y perfil actual (client_credit_profiles).

---

## 5. Collection / Debt Recovery

**Propósito:** Gestiones de cobranza para recuperar pagos pendientes.

| Tabla               | Entidad        | Descripción |
|---------------------|----------------|-------------|
| `collection_actions`| CollectionAction | Gestiones de cobranza (tipo, resultado, fecha, cliente, préstamo). |

*Referencias:* cliente (`clients`), préstamo opcional (`loans`).

**Funcionalidades que abarca:**
- Registrar gestión de cobranza (llamada, email, visita, aviso, acción legal).
- Registrar resultado y notas de la gestión.
- Listar gestiones por cliente.
- Listar gestiones por préstamo.
- Seguimiento del estado de cobranza por cliente o por crédito.

---

## 6. Audit

**Propósito:** Trazabilidad de acciones críticas del sistema.

| Tabla        | Entidad  | Descripción |
|--------------|----------|-------------|
| `audit_logs` | AuditLog | Registro de acción, entidad, id, valores old/new, usuario, IP, fecha. |

**Funcionalidades que abarca:**
- Registrar evento de auditoría (acción, tipo de entidad, id, old/new values, usuario, IP, user-agent).
- Consulta de logs por administradores (para cumplimiento y debugging).
- Ser invocado por otros contextos (IAM, Credit Management, Payments, Risk & Scoring, Collection) en acciones sensibles (login, aprobación, pago, cambio de scoring, etc.).

---

## Resumen por contexto

| Bounded Context        | Tablas / Entidades | Funcionalidades principales |
|------------------------|--------------------|-----------------------------|
| **IAM / Users**        | users, roles, user_roles | Auth, perfiles, roles, auditoría de usuario. |
| **Credit Management**  | loans, loan_refinances, installments, loan_charges, penalty_policies, late_fees, loan_history | Simulación, creación, aprobación, desembolso, refinanciamiento, cargos, mora, historial. |
| **Payments**           | payments, payment_applications | Registrar pago, distribuir en cuotas, parcial/adelantado, consultas. |
| **Risk & Scoring**     | clients, credit_evaluations, credit_score_history, client_background_checks, external_debts, client_credit_profiles | Clientes, scoring, evaluación, verificaciones, deudas externas, perfil. |
| **Collection**         | collection_actions | Gestiones de cobranza, seguimiento por cliente/préstamo. |
| **Audit**              | audit_logs | Trazabilidad, registro desde otros contextos, consulta de logs. |
