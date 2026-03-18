# IAM — Pendientes de arquitectura (DDD + Clean)

> Nota: **no ejecutar estos cambios aún**. Este documento solo lista lo que falta para “pulir” el módulo IAM y dejarlo 100% alineado a Onion/Clean.

## Estado actual (resumen)

- El contexto **IAM ya vive en** `src/modules/iam`.
- `src/iam` ya no existe.
- JWT/guards/decorators viven en `src/modules/iam/presentation/guards`.
- Otros módulos ya consumen guards y `RoleName` desde `src/modules/iam/...`.

## Pendientes (en orden recomendado)

### 1) Separar DTOs de Application por caso de uso (sacar tipos “inline”)

- **Problema**: algunos use-cases definen `Command/Response` dentro del mismo archivo (ej. `CreateAnalystCommand/Response`).
- **Objetivo**: mover esos contratos a `src/modules/iam/application/dtos/` por feature/caso de uso.
- **Ejemplo de destino**:
  - `src/modules/iam/application/dtos/users/create-analyst.dto.ts`
  - `src/modules/iam/application/dtos/users/get-user.dto.ts`
  - `src/modules/iam/application/dtos/roles/get-role.dto.ts`

**Regla**: application devuelve **Response DTOs** (no entidades). Los HTTP DTOs quedan en presentation.

---

### 2) Definir “API pública” del módulo (evitar imports internos desde otros módulos)

- **Problema**: otros módulos importan directo rutas internas (acoplamiento a la estructura de carpetas).
- **Objetivo**: exponer un único punto de import estable.
- **Propuesta**:
  - Crear `src/modules/iam/public.ts` (o `index.ts`) exportando solo lo permitido:
    - `RoleName`
    - `JwtAuthGuard`, `RolesGuard`
    - `Roles`, `Public`, `CurrentUser`
    - tipos `RequestUser` (si se usa fuera)

Luego, en los demás módulos, reemplazar imports a rutas internas por:
- `import { RolesGuard, Roles, CurrentUser, RoleName } from '../modules/iam/public'` *(según el path relativo real)*

---

### 3) Ubicar auth en infraestructura vs presentación (opcional “ultra clean”)

Actualmente:
- `presentation/guards/*` contiene `JwtStrategy`, guards y decorators.

Opcional para mayor pureza:
- **Infrastructure**: `JwtStrategy` (porque es integración con Passport/JWT)
  - `src/modules/iam/infrastructure/external/auth/jwt.strategy.ts`
- **Presentation**: guards/decorators HTTP
  - `src/modules/iam/presentation/guards/*`

> Este punto es opcional: el estado actual funciona y es aceptable, pero si quieres Onion estricto, conviene separar.

---

### 4) Shared Kernel (cuando escale a más módulos)

- **Objetivo**: evitar que cada módulo reinvente tokens, errores base, helpers.
- **Propuesta**: introducir `src/shared/kernel` con:
  - Excepciones base
  - Tipos genéricos (Result/Either) si los adoptas
  - UnitOfWork/Transaction abstractions (si luego las necesitas)

> No es requisito para IAM en este momento; se recomienda cuando arranquemos refactor de los demás módulos.

