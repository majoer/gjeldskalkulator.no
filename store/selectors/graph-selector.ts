import { Datum } from "@nivo/line";
import { createSelector } from "@reduxjs/toolkit";
import { selectAllDebts, selectSumDebt, DebtState } from "../debt-slice";
import { selectResult } from "./result-selector";

const maxMonths = 12 * 5;

interface Debt extends DebtState {
  paidSoFar: number;
}

export const selectDebtSerie = createSelector(
  [selectResult, selectAllDebts, selectSumDebt],
  (result, allDebt, sumDebt) => {
    const selectDebtSerie: Datum[] = [];

    selectDebtSerie.push({
      x: 0,
      y: sumDebt,
      interestPaid: 0,
      deductionPaint: 0,
    });

    let month = 1;
    let debtSoFar = allDebt.map((debt) => ({ ...debt, paidSoFar: 0 }));
    let sumDebtSoFar = sumDebt;
    while (sumDebtSoFar > 0 && month <= maxMonths) {
      debtSoFar = advanceDebt(debtSoFar, result > 0 ? result : 0);
      sumDebtSoFar = debtSoFar.reduce((sum, debt) => (sum += debt.amount), 0);
      const deductionPaid = Math.round(
        debtSoFar.reduce((sum, debt) => (sum += debt.paidSoFar), 0)
      );

      selectDebtSerie.push({
        x: month,
        y: sumDebtSoFar,
        interestPaid: 1,
        deductionPaid,
      });

      month++;
    }

    return selectDebtSerie;
  }
);

function advanceDebt(currentDebt: Debt[], deduction: number) {
  if (currentDebt.length === 0) {
    return [];
  }

  const debtAfterInterest = currentDebt
    .filter((debt) => debt.amount > 0)
    .map((debt) => ({
      ...debt,
      amount: (debt.interest * debt.amount) / 12 + debt.amount,
    }));

  return applyMontlyDeduction(debtAfterInterest, deduction);
}

function applyMontlyDeduction(currentDebt: Debt[], deduction: number) {
  let rest = deduction;

  return currentDebt.map((debt) => {
    const deductionAfterFee = rest - debt.fee;
    const newDebt = Math.max(debt.amount - deductionAfterFee, 0);
    rest = Math.max(deductionAfterFee - debt.amount, 0);

    return {
      ...debt,
      amount: newDebt,
      paidSoFar: debt.paidSoFar + deduction - rest,
    };
  });
}
