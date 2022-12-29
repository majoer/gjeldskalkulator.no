import { Datum } from "@nivo/line";
import { createSelector } from "@reduxjs/toolkit";
import { selectAllDebts, selectSumDebt, DebtState } from "../debt-slice";
import { selectResult } from "./result-selector";

const maxMonths = 24;

export const selectDebtSerie = createSelector(
  [selectResult, selectAllDebts, selectSumDebt],
  (result, allDebt, sumDebt) => {
    const selectDebtSerie: Datum[] = [];

    selectDebtSerie.push({
      x: 0,
      y: sumDebt,
    });

    let month = 1;
    let debtSoFar = allDebt;
    let sumDebtSoFar = sumDebt;
    while (sumDebtSoFar > 0 && month <= maxMonths) {
      debtSoFar = advanceDebt(debtSoFar, result > 0 ? result : 0);
      sumDebtSoFar = debtSoFar.reduce((sum, debt) => (sum += debt.amount), 0);
      selectDebtSerie.push({
        x: month,
        y: sumDebtSoFar,
      });

      month++;
    }

    return selectDebtSerie;
  }
);

function advanceDebt(currentDebt: DebtState[], deduction: number) {
  if (currentDebt.length === 0) {
    return [];
  }

  const debtAfterDeduction = applyMontlyDeduction(currentDebt, deduction);
  const nextDebt = debtAfterDeduction
    .filter((debt) => debt.amount > 0)
    .map((debt) => ({
      ...debt,
      amount: debt.interest * debt.amount + debt.amount,
    }));

  return nextDebt;
}

//Todo: write in non-mutating way
function applyMontlyDeduction(currentDebt: DebtState[], deduction: number) {
  let rest = deduction;

  return currentDebt.map((debt) => {
    const newDebt = Math.max(debt.amount - rest, 0);
    rest = Math.max(rest - debt.amount, 0);

    return {
      ...debt,
      amount: newDebt,
    };
  });
}
