# Avance: Estructura DDD – Entidades, Módulos y Repositorios

Resumen de lo implementado según `proyecto-detail.md` y la arquitectura por dominio acordada. **Sin lógica de negocio ni cálculos**; solo estructura de capas y contratos de repositorio.

---

## 1. IAM / Users

**Carpeta:** `src/iam/`

| Elemento | Archivos |
|----------|----------|
| **Entidades** | `User`, `Role`, `UserRole` |
| **Ports** | `UserRepositoryPort`, `RoleRepositoryPort`, `UserRoleRepositoryPort` |
| **Repositorios** | `UserRepository`, `RoleRepository`, `UserRoleRepository` (stub) |
| **Módulo** | `IamModule` |

- **User:** id, email, name, passwordHash, isActive, createdAt, updatedAt.
- **Role:** id, name, description, createdAt, updatedAt.
- **UserRole:** id, userId, roleId, assignedAt.

---

## 2. Credit Management

**Carpeta:** `src/credit-management/`

| Elemento | Archivos |
|----------|----------|
| **Entidades** | `Loan`, `LoanRefinance`, `Installment`, `LoanCharge`, `PenaltyPolicy`, `LateFee`, `LoanHistory` |
| **Ports** | Un port por entidad (findById, findByXxx, save) |
| **Repositorios** | Implementaciones stub en `infrastructure/persistence/` |
| **Módulo** | `CreditManagementModule` |

- **Loan:** id, clientId, amount, interestRate, termMonths, interestType, status, createdAt, updatedAt. Status: pending_approval | approved | rejected | disbursed | refinanced | closed.
- **LoanRefinance:** id, originalLoanId, newLoanId, refinancedAt.
- **Installment:** id, loanId, number, dueDate, principalAmount, interestAmount, totalAmount, status, paidAt, createdAt, updatedAt. Status: pending | partial | paid | overdue.
- **LoanCharge:** id, loanId, type, amount, description, createdAt.
- **PenaltyPolicy:** id, name, penaltyPercentage, graceDays, calculationType, isActive, createdAt, updatedAt.
- **LateFee:** id, installmentId, amount, appliedAt, penaltyPolicyId.
- **LoanHistory:** id, loanId, action, previousState, newState, userId, createdAt.

---

## 3. Payments

**Carpeta:** `src/payments/`

| Elemento | Archivos |
|----------|----------|
| **Entidades** | `Payment`, `PaymentApplication` |
| **Ports** | `PaymentRepositoryPort`, `PaymentApplicationRepositoryPort` |
| **Repositorios** | Stub en `infrastructure/persistence/` |
| **Módulo** | `PaymentsModule` |

- **Payment:** id, clientId, loanId, amount, method, reference, paidAt, createdAt.
- **PaymentApplication:** id, paymentId, installmentId, principalAmount, interestAmount, lateFeeAmount, appliedAt.

---

## 4. Risk & Scoring

**Carpeta:** `src/risk-scoring/`

| Elemento | Archivos |
|----------|----------|
| **Entidades** | `Client`, `CreditEvaluation`, `CreditScoreHistory`, `ClientBackgroundCheck`, `ExternalDebt`, `ClientCreditProfile` |
| **Ports** | Un port por entidad |
| **Repositorios** | Stub en `infrastructure/persistence/` |
| **Módulo** | `RiskScoringModule` |

- **Client:** id, documentType, documentNumber, name, email, phone, monthlyIncome, createdAt, updatedAt.
- **CreditEvaluation:** id, clientId, score, approved, factors, evaluatedAt, evaluatedByUserId.
- **CreditScoreHistory:** id, clientId, score, recordedAt.
- **ClientBackgroundCheck:** id, clientId, type, result, details, checkedAt.
- **ExternalDebt:** id, clientId, creditorName, amount, monthlyPayment, recordedAt.
- **ClientCreditProfile:** id, clientId, currentScore, riskLevel, totalDebt, onTimePaymentsCount, latePaymentsCount, updatedAt.

---

## 5. Collection / Debt Recovery

**Carpeta:** `src/collection/`

| Elemento | Archivos |
|----------|----------|
| **Entidades** | `CollectionAction` |
| **Ports** | `CollectionActionRepositoryPort` |
| **Repositorios** | `CollectionActionRepository` (stub) |
| **Módulo** | `CollectionModule` |

- **CollectionAction:** id, clientId, loanId (opcional), actionType, result, notes, performedAt, performedByUserId.

---

## 6. Audit

**Carpeta:** `src/audit/`

| Elemento | Archivos |
|----------|----------|
| **Entidades** | `AuditLog` |
| **Ports** | `AuditLogRepositoryPort` |
| **Repositorios** | `AuditLogRepository` (stub) |
| **Módulo** | `AuditModule` |

- **AuditLog:** id, action, entityType, entityId, oldValues, newValues, userId, ip, userAgent, createdAt.

---

## Estructura de carpetas por contexto

Cada bounded context sigue el mismo patrón:

```
<contexto>/
├── domain/
│   └── entities/
├── application/
│   └── ports/          # Interfaces de repositorio (Symbol + interface)
├── infrastructure/
│   └── persistence/    # Implementaciones stub
└── <contexto>.module.ts
```

---

## Registro en la aplicación

En `src/app.module.ts` se importan los seis módulos:

- `IamModule`
- `CreditManagementModule`
- `PaymentsModule`
- `RiskScoringModule`
- `CollectionModule`
- `AuditModule`

---

## Qué falta (no implementado a propósito)

- **Lógica de negocio y cálculos:** reglas de negocio, simulaciones, scoring, mora, distribución de pagos, etc.
- **Persistencia real:** los repositorios son stub (retornan `null`/`[]`, `save` no persiste).
- **Casos de uso (application layer):** use cases que orquesten entidades y repositorios.
- **Controladores y DTOs:** capa de presentación por contexto.
- **Validaciones y reglas de dominio:** por ahora las entidades son clases de datos.

---

## Resumen de archivos creados

| Contexto | Entidades | Ports | Repositorios | Módulo |
|----------|-----------|-------|--------------|--------|
| IAM | 3 | 3 | 3 | IamModule |
| Credit Management | 7 | 7 | 7 | CreditManagementModule |
| Payments | 2 | 2 | 2 | PaymentsModule |
| Risk & Scoring | 6 | 6 | 6 | RiskScoringModule |
| Collection | 1 | 1 | 1 | CollectionModule |
| Audit | 1 | 1 | 1 | AuditModule |
| **Total** | **20** | **20** | **20** | **6** |

Todos los repositorios están registrados por **Symbol** en su módulo y exportados para poder inyectarlos en otros módulos o en futuros use cases.
