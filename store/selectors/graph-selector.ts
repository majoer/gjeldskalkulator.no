import { Datum } from "@nivo/line";
import { createSelector } from "@reduxjs/toolkit";
import { selectAllDebts, selectSumDebt, DebtState } from "../debt-slice";
import { selectUseTowardsDebt } from "./result-selector";

export const MAX_MONTHS = 12 * 100;
export const PLAN_TOO_LONG_TO_CALCULATE = -1;
export const PLAN_BLOWS_TO_INFINITY = -2;

interface Debt extends DebtState {
  paidSoFar: number;
  interestPaidSoFar: number;
}

export interface DebtDatum extends Datum {
  sumInterestPaidSoFar: number;
  sumPaidSoFar: number;
}

export interface DebtSerieSelectorResult {
  resolution: "Month" | "Year";
  serie: DebtDatum[];
  paymentPlan: DebtDatum[];
}

export const selectDebtSeries = createSelector(
  [selectUseTowardsDebt, selectAllDebts, selectSumDebt],
  (useTowardsDebt, allDebt, sumDebt): DebtSerieSelectorResult => {
    const serie: DebtDatum[] = [
      {
        x: 0,
        y: sumDebt,
        sumInterestPaidSoFar: 0,
        sumPaidSoFar: 0,
      },
    ];

    let month = 1;
    let debtSoFar: Debt[] = allDebt.map((debt) => ({
      ...debt,
      paidSoFar: 0,
      interestPaidSoFar: 0,
    }));
    let sumDebtSoFar = sumDebt;
    while (sumDebtSoFar > 0 && month <= MAX_MONTHS) {
      debtSoFar = advanceDebt(debtSoFar, Math.max(useTowardsDebt, 0));
      sumDebtSoFar = debtSoFar.reduce((sum, debt) => (sum += debt.amount), 0);
      const latestDebt = debtSoFar[debtSoFar.length - 1];
      const sumInterestPaidSoFar = latestDebt.interestPaidSoFar;
      const sumPaidSoFar = latestDebt.paidSoFar;

      serie.push({
        x: month,
        y: sumDebtSoFar,
        sumInterestPaidSoFar,
        sumPaidSoFar,
      });

      month++;
    }

    if (serie.length >= 12 * 5) {
      return {
        resolution: "Year",
        paymentPlan: serie,
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
      paymentPlan: serie,
    };
  }
);

function advanceDebt(currentDebt: Debt[], deduction: number) {
  if (currentDebt.length === 0) {
    return [];
  }

  const debtAfterInterest = currentDebt.map((debt) => {
    if (debt.amount === 0) {
      return debt;
    }

    const interest = debt.interest.multipliedBy(debt.amount).dividedBy(12);
    const newDebt = interest.plus(debt.amount).toNumber();

    return {
      ...debt,
      amount: newDebt,
      interestPaidSoFar: interest.plus(debt.interestPaidSoFar).toNumber(),
    };
  });

  return applyMontlyDeduction(debtAfterInterest, deduction);
}

export const selectTotalCostOfDebt = createSelector(
  [selectDebtSeries],
  ({ serie }) => {
    const lastDatum = serie[serie.length - 1];

    if (serie.length === 1) {
      return lastDatum.sumPaidSoFar;
    }

    if (12 * (serie.length - 1) === MAX_MONTHS) {
      return lastDatum.y > serie[serie.length - 2].y
        ? PLAN_BLOWS_TO_INFINITY
        : PLAN_TOO_LONG_TO_CALCULATE;
    }

    return Math.round(serie[serie.length - 1].sumPaidSoFar);
  }
);

function applyMontlyDeduction(currentDebt: Debt[], deduction: number) {
  let rest = deduction;

  return currentDebt.map((debt) => {
    if (debt.amount === 0) {
      return debt;
    }
    const deductionAfterFee = rest - debt.fee;
    const newDebt = Math.max(debt.amount - deductionAfterFee, 0);
    rest = Math.max(deductionAfterFee - debt.amount, 0);
    const paidSoFar = debt.paidSoFar + deduction - rest;

    return {
      ...debt,
      amount: newDebt,
      paidSoFar,
    };
  });
}
