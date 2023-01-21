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

export type PaymentPlanEventType = "UNABLE_TO_PAY" | "DEBT_PAID_OFF";

interface PaymentPlanEvent {
  type: PaymentPlanEventType;
  debt: Debt;
  month: number;
}

export interface DebtHistory {
  month: number;
  remaining: BigNumber.BigNumber;
  paidSoFar: BigNumber.BigNumber;
  interestPaidSoFar: BigNumber.BigNumber;
  terminResult: TerminResult;
}

export interface Debt {
  initial: DebtState;
  events: PaymentPlanEvent[];
  history: DebtHistory[];
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
  events: PaymentPlanEvent[];
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
    let allEvents: PaymentPlanEvent[] = [];

    while (sumDebtSoFar.isGreaterThan(0) && month <= MAX_MONTHS) {
      const { newDebt, events } = advanceDebt(debtSoFar, useTowardsDebt, month);
      debtSoFar = newDebt;
      allEvents = [...allEvents, ...events];
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
        y: sumDebtSoFar.integerValue().toNumber(),
        sumInterestPaidSoFar: sumInterestPaidSoFar.integerValue().toNumber(),
        sumPaidSoFar: sumPaidSoFar.integerValue().toNumber(),
      });

      month++;
    }

    if (serie.length >= 12 * 5) {
      return {
        resolution: "Year",
        paymentPlan: serie,
        events: allEvents,
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
      paymentPlan: serie,
      events: allEvents,
      serie,
    };
  }
);

function advanceDebt(
  currentDebt: Debt[],
  moneyToDistribute: BigNumber.BigNumber,
  month: number
): {
  events: PaymentPlanEvent[];
  newDebt: Debt[];
} {
  if (currentDebt.length === 0) {
    return {
      events: [],
      newDebt: [],
    };
  }
  let rest = moneyToDistribute;
  const events: PaymentPlanEvent[] = [];

  return {
    newDebt: currentDebt.map((debt) => {
      if (debt.processed.remaining.isEqualTo(0)) {
        return debt;
      }

      const terminResult = debt.calculateTermin(debt, rest);
      const { terminAmount, interestAmount, newDebt, newRest } = terminResult;

      const processed = {
        paidSoFar: debt.processed.paidSoFar.plus(terminAmount),
        remaining: newDebt,
        interestPaidSoFar: debt.processed.interestPaidSoFar.plus(interestAmount),
      };

      const updatedDebt: Debt = {
        ...debt,
        events,
        history: [...debt.history, { ...processed, month, terminResult }],
        processed,
      };

      rest = newRest;
      if (terminAmount.isZero()) {
        events.push({ type: "UNABLE_TO_PAY", debt: updatedDebt, month });
      } else if (newDebt.isZero()) {
        events.push({ type: "DEBT_PAID_OFF", debt: updatedDebt, month });
      }

      return updatedDebt;
    }),
    events,
  };
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
      const targetPrincipalAmount = BigNumber.BigNumber(debt.amount)
        .dividedBy(debt.termins)
        .integerValue(BigNumber.BigNumber.ROUND_UP);

      return (
        { processed: { remaining }, events }: Debt,
        moneyToDistribute: BigNumber.BigNumber
      ) => {
        const interestAmount = monthlyInterest.multipliedBy(remaining);
        const principalAmount = BigNumber.BigNumber.min(targetPrincipalAmount, remaining);
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
        const newDebt = remaining.minus(principalAmount);
        const newRest = moneyToDistribute.minus(terminAmount);

        return {
          terminAmount,
          interestAmount,
          principalAmount,
          newDebt,
          newRest,
          events,
        };
      };
    }
    case "annuity":
      const targetTerminAmount = monthlyInterest
        .dividedBy(one.minus(one.plus(monthlyInterest).pow(-debt.termins)))
        .multipliedBy(debt.amount)
        .integerValue(BigNumber.BigNumber.ROUND_UP);

      return ({ processed: { remaining } }: Debt, moneyToDistribute: BigNumber.BigNumber) => {
        const interestAmount = interest.dividedBy(12).multipliedBy(remaining);
        const terminAmount = BigNumber.BigNumber.min(
          targetTerminAmount,
          remaining.plus(interestAmount)
        );
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

        const newDebt = remaining.minus(principalAmount);
        const newRest = moneyToDistribute.minus(terminAmount);

        return {
          terminAmount,
          interestAmount,
          principalAmount,
          newDebt,
          newRest,
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
        const newDebt = remaining.minus(principalAmount);
        const newRest = moneyToDistribute.minus(terminAmount);

        return {
          terminAmount,
          interestAmount,
          principalAmount: BigNumber.BigNumber.max(principalAmount, 0),
          newDebt,
          newRest,
        };
      };
    }
  }
}

function toDebt(debt: DebtState): Debt {
  const interest = BigNumber.BigNumber(debt.interest).dividedBy(100);
  return {
    initial: debt,
    events: [],
    history: [],
    processed: {
      interestPaidSoFar: BigNumber.BigNumber(0),
      paidSoFar: BigNumber.BigNumber(0),
      remaining: BigNumber.BigNumber(debt.amount),
    },
    calculateTermin: getTerminFunction(debt, interest),
  };
}
