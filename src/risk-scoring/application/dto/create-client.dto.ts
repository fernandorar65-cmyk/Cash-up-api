/**
 * Contrato de entrada/salida del caso de uso CreateClient.
 * Capa aplicación.
 */
export interface CreateClientInput {
  userId: string;
  documentType: string;
  documentNumber: string;
  name: string;
  email: string | null;
  phone: string | null;
  monthlyIncome: number;
}

export interface CreateClientResult {
  id: string;
  documentType: string;
  documentNumber: string;
  name: string;
  email: string | null;
  phone: string | null;
  monthlyIncome: number;
}
