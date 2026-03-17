/**
 * Contrato de entrada/salida del caso de uso CreateAnalyst.
 * Capa aplicación (no presentación ni dominio).
 */
export interface CreateAnalystInput {
  email: string;
  name: string;
  password: string;
}

export interface CreateAnalystResult {
  id: string;
  email: string;
  name: string;
}
