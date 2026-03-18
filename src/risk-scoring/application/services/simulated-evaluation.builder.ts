/**
 * Genera datos de evaluación simulados (buros, antecedentes, etc.).
 * outcome: 1 = positivo, 2 = negativo, undefined = aleatorio.
 */
export type SimulatedEvaluationOutcome = 1 | 2;

export interface SimulatedEvaluationData {
  score: number;
  approved: boolean;
  riskLevel: string;
  factors: Record<string, unknown>;
  totalDebt: number;
  onTimePaymentsCount: number;
  latePaymentsCount: number;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

export function buildSimulatedEvaluation(
  outcome?: SimulatedEvaluationOutcome,
): SimulatedEvaluationData {
  const positive =
    outcome === 1
      ? true
      : outcome === 2
        ? false
        : Math.random() >= 0.5;

  if (positive) {
    const score = Number(randomBetween(72, 98).toFixed(2));
    const riskLevel = score >= 85 ? 'LOW' : 'MEDIUM';
    return {
      score,
      approved: true,
      riskLevel,
      factors: {
        simulated: true,
        outcomeMode: outcome ?? 'random',
        sources: ['bureau_simulated', 'internal'],
        bankHistorySummary: 'clean',
        criminalRecord: false,
        externalDebtCount: randomInt(0, 1),
        monthsInNegativeDatabase: 0,
        notes: 'Simulación: historial favorable.',
      },
      totalDebt: Number(randomBetween(0, 5000).toFixed(2)),
      onTimePaymentsCount: randomInt(8, 24),
      latePaymentsCount: randomInt(0, 2),
    };
  }

  const score = Number(randomBetween(12, 48).toFixed(2));
  return {
    score,
    approved: false,
    riskLevel: 'HIGH',
    factors: {
      simulated: true,
      outcomeMode: outcome ?? 'random',
      sources: ['bureau_simulated', 'internal'],
      bankHistorySummary: Math.random() > 0.4 ? 'defaults' : 'late_payments',
      criminalRecord: Math.random() > 0.7,
      externalDebtCount: randomInt(2, 6),
      monthsInNegativeDatabase: randomInt(0, 18),
      notes: 'Simulación: señales de riesgo (para pruebas).',
    },
    totalDebt: Number(randomBetween(15000, 80000).toFixed(2)),
    onTimePaymentsCount: randomInt(0, 5),
    latePaymentsCount: randomInt(4, 20),
  };
}
