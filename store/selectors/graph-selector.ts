import { Datum } from "@nivo/line";
import { createSelector } from "@reduxjs/toolkit";
import * as BigNumber from "bignumber.js";
import { DebtState, selectAllDebts, selectSumDebt } from "../debt-slice";
import { selectUseTowardsDebt } from "./result-selector";

export const MAX_MONTHS = 12 * 100;
export const PLAN_TOO_LONG_TO_CALCULATE = -1;
export const PLAN_BLOWS_TO_INFINITY = -2;

export interface TerminResult {
  terminAmount: BigNumber.BigNumber;
  interestAmount: BigNumber.BigNumber;
  principalAmount: BigNumber.BigNumber;
  newDebt: BigNumber.BigNumber;
  newRest: BigNumber.BigNumber;
}
export type TerminFunction = (debt: Debt, moneyToDistribute: BigNumber.BigNumber) => TerminResult;

interface PaymentPlanEvent {
  time: string;
  name: string;
}

interface Debt {
  initial: DebtState;
  processed: {
    remaining: BigNumber.BigNumber;
    paidSoFar: BigNumber.BigNumber;
    interestPaidSoFar: BigNumber.BigNumber;
  };
  calculateTermin: TerminFunction;
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
    let sumDebtSoFar = BigNumber.BigNumber(sumDebt);
    let debtSoFar: Debt[] = allDebt.map(toDebt);

    while (sumDebtSoFar.isGreaterThan(0) && month <= MAX_MONTHS) {
      debtSoFar = advanceDebt(debtSoFar, useTowardsDebt);
      sumDebtSoFar = debtSoFar.reduce(
        (sum, debt) => sum.plus(debt.processed.remaining),
        BigNumber.BigNumber(0)
      );
      const sumInterestPaidSoFar = debtSoFar.reduce(
        (sum, debt) => sum.plus(debt.processed.interestPaidSoFar),
        BigNumber.BigNumber(0)
      );
      const sumPaidSoFar = debtSoFar.reduce(
        (sum, debt) => sum.plus(debt.processed.paidSoFar),
        BigNumber.BigNumber(0)
      );

      serie.push({
        x: month,
        y: sumDebtSoFar.toNumber(),
        sumInterestPaidSoFar: sumInterestPaidSoFar.toNumber(),
        sumPaidSoFar: sumPaidSoFar.toNumber(),
      });

      month++;
    }

    if (serie.length >= 12 * 5) {
      return {
        resolution: "Year",
        paymentPlan: serie,
        serie: serie
          .filter((_, i) => {
            return i % 12 === 0 || i === serie.length - 1;
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

function advanceDebt(currentDebt: Debt[], moneyToDistribute: BigNumber.BigNumber): Debt[] {
  if (currentDebt.length === 0) {
    return [];
  }
  let rest = moneyToDistribute;

  return currentDebt.map((debt) => {
    if (debt.processed.remaining.isEqualTo(0)) {
      return debt;
    }

    const { terminAmount, interestAmount, principalAmount, newDebt, newRest } =
      debt.calculateTermin(debt, rest);

    rest = newRest;

    return {
      ...debt,
      processed: {
        paidSoFar: debt.processed.paidSoFar.plus(terminAmount),
        remaining: newDebt,
        interestPaidSoFar: debt.processed.interestPaidSoFar.plus(interestAmount),
      },
    };
  });
}

export const selectTotalCostOfDebt = createSelector([selectDebtSeries], ({ serie }) => {
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
});

function getTerminFunction(debt: DebtState, interest: BigNumber.BigNumber): TerminFunction {
  const monthlyInterest = interest.dividedBy(12);
  const one = BigNumber.BigNumber(1);

  switch (debt.type) {
    case "serie": {
      const principalAmount = BigNumber.BigNumber(debt.amount).dividedBy(debt.termins);

      return ({ processed: { remaining } }: Debt, moneyToDistribute: BigNumber.BigNumber) => {
        const interestAmount = monthlyInterest.multipliedBy(remaining);
        const terminAmount = interestAmount.plus(principalAmount);
        const canPay = moneyToDistribute.isGreaterThanOrEqualTo(terminAmount);

        if (!canPay) {
          return {
            terminAmount: BigNumber.BigNumber(0),
            interestAmount: BigNumber.BigNumber(0),
            principalAmount: BigNumber.BigNumber(0),
            newDebt: remaining.plus(interestAmount),
            newRest: moneyToDistribute,
          };
        }

        return {
          terminAmount,
          interestAmount,
          principalAmount,
          newDebt: remaining.minus(principalAmount),
          newRest: moneyToDistribute.minus(terminAmount),
        };
      };
    }
    case "annuity":
      const terminAmount = monthlyInterest
        .dividedBy(one.minus(one.plus(monthlyInterest).pow(-debt.termins)))
        .multipliedBy(debt.amount);

      return ({ processed: { remaining } }: Debt, moneyToDistribute: BigNumber.BigNumber) => {
        const interestAmount = interest.dividedBy(12).multipliedBy(remaining);
        const principalAmount = terminAmount.minus(interestAmount);
        const canPay = moneyToDistribute.isGreaterThanOrEqualTo(terminAmount);

        if (!canPay) {
          return {
            terminAmount: BigNumber.BigNumber(0),
            interestAmount: BigNumber.BigNumber(0),
            principalAmount: BigNumber.BigNumber(0),
            newDebt: remaining.plus(interestAmount),
            newRest: moneyToDistribute,
          };
        }

        return {
          terminAmount,
          interestAmount,
          principalAmount,
          newDebt: remaining.minus(principalAmount),
          newRest: moneyToDistribute.minus(terminAmount),
        };
      };
    case "credit": {
      return ({ processed: { remaining } }: Debt, moneyToDistribute: BigNumber.BigNumber) => {
        const interestAmount = monthlyInterest.multipliedBy(remaining);
        const terminAmount = BigNumber.BigNumber.min(
          moneyToDistribute,
          remaining.plus(interestAmount)
        );
        const principalAmount = terminAmount.minus(interestAmount);

        return {
          terminAmount,
          interestAmount,
          principalAmount,
          newDebt: remaining.minus(principalAmount),
          newRest: moneyToDistribute.minus(terminAmount),
        };
      };
    }
  }
}

function toDebt(debt: DebtState): Debt {
  const interest = BigNumber.BigNumber(debt.interest).dividedBy(100);
  return {
    initial: debt,
    processed: {
      interestPaidSoFar: BigNumber.BigNumber(0),
      paidSoFar: BigNumber.BigNumber(0),
      remaining: BigNumber.BigNumber(debt.amount),
    },
    calculateTermin: getTerminFunction(debt, interest),
  };
}
