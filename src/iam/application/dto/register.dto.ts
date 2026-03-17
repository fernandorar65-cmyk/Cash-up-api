/**
 * Contrato de entrada/salida del caso de uso Register.
 * Capa aplicación (no presentación ni dominio).
 */
export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface RegisterResult {
  id: string;
  email: string;
  name: string;
}
