/**
 * Ciclo de vida de la solicitud de crédito.
 * APPROVED → debe existir loan_id y el cronograma en installments.
 */
export enum CreditRequestStatus {
  /** Cliente envió la solicitud; pendiente de analista / motor */
  PENDING = 'PENDING',
  /** (Opcional) analista la está revisando */
  UNDER_REVIEW = 'UNDER_REVIEW',
  /** Aprobada: se creó Loan + cuotas; loan_id rellenado */
  APPROVED = 'APPROVED',
  /** Rechazada por analista; rejection_reason recomendado */
  REJECTED = 'REJECTED',
  /** Cliente retiró la solicitud */
  CANCELLED = 'CANCELLED',
}
