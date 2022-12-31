import { Datum } from "@nivo/line";
import { createSelector } from "@reduxjs/toolkit";
import { selectAllDebts, selectSumDebt, DebtState } from "../debt-slice";
import { selectResult } from "./result-selector";

export const maxMonths = 12 * 100;

interface Debt extends DebtState {
  paidSoFar: number;
}

export interface DebtDatum extends Datum {
  interestPaidSoFar: number;
  sumPaidSoFar: number;
}

export interface DebtSerieSelectorResult {
  resolution: "Month" | "Year";
  serie: DebtDatum[];
}

export const selectDebtSeries = createSelector(
  [selectResult, selectAllDebts, selectSumDebt],
  (result, allDebt, sumDebt): DebtSerieSelectorResult => {
    const serie: DebtDatum[] = [
      {
        x: 0,
        y: sumDebt,
        interestPaidSoFar: 0,
        sumPaidSoFar: 0,
      },
    ];

    let month = 1;
    let debtSoFar = allDebt.map((debt) => ({ ...debt, paidSoFar: 0 }));
    let sumDebtSoFar = sumDebt;
    while (sumDebtSoFar > 0 && month <= maxMonths) {
      debtSoFar = advanceDebt(debtSoFar, result > 0 ? result : 0);
      sumDebtSoFar = debtSoFar.reduce((sum, debt) => (sum += debt.amount), 0);
      const sumPaidSoFar = Math.round(
        debtSoFar.reduce((sum, debt) => (sum += debt.paidSoFar), 0)
      );

      serie.push({
        x: month,
        y: sumDebtSoFar,
        interestPaidSoFar: 1,
        sumPaidSoFar,
      });

      month++;
    }

    if (serie.length >= 12 * 5) {
      return {
        resolution: "Year",
        serie: serie
          .filter((_, i) => {
            return i % 12 === 0;
          })
          .map((datum, i) => ({
            ...datum,
            x: i,
          })),
      };
    }

    return {
      resolution: "Month",
      serie,
    };
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
      amount: debt.interest
        .multipliedBy(debt.amount)
        .dividedBy(12)
        .plus(debt.amount)
        .toNumber(),
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
