/**
 * Cronograma tipo cuota fija (sistema francés). Tasa anual en %.
 */
export interface ScheduleRow {
  number: number;
  dueDate: Date;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
}

/** REDONDEAR A 2 DECIMALES */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function addMonths(d: Date, months: number): Date {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
}

export function buildFrenchAmortizationSchedule(params: {
  principal: number;
  annualInterestRatePercent: number;
  termMonths: number;
  firstDueDate: Date;
}): ScheduleRow[] {
  const { principal, annualInterestRatePercent, termMonths, firstDueDate } =
    params;
  const n = termMonths;
  const P = principal;
  const r = annualInterestRatePercent / 100 / 12;
  const rows: ScheduleRow[] = [];

  if (n <= 0 || P <= 0) {
    return rows;
  }

  let balance = round2(P);

  if (r === 0) {
    const pay = round2(P / n);
    for (let i = 1; i <= n; i++) {
      const isLast = i === n;
      const principalAmt = isLast ? round2(balance) : pay;
      rows.push({
        number: i,
        dueDate: addMonths(firstDueDate, i - 1),
        principalAmount: principalAmt,
        interestAmount: 0,
        totalAmount: principalAmt,
      });
      balance = round2(balance - principalAmt);
    }
    return rows;
  }

  const payment = round2(
    (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1),
  );

  for (let i = 1; i <= n; i++) {
    const interestAmt = round2(balance * r);
    let principalAmt = round2(payment - interestAmt);
    if (i === n) {
      principalAmt = round2(balance);
    }
    const total = round2(principalAmt + interestAmt);
    rows.push({
      number: i,
      dueDate: addMonths(firstDueDate, i - 1),
      principalAmount: principalAmt,
      interestAmount: interestAmt,
      totalAmount: total,
    });
    balance = round2(balance - principalAmt);
  }

  return rows;
}
