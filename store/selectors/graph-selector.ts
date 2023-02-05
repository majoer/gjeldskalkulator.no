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
  history: DebtHistory[];
  processed: {
    remaining: BigNumber.BigNumber;
    paidSoFar: BigNumber.BigNumber;
    interestPaidSoFar: BigNumber.BigNumber;
  };
}

export interface DebtDatum extends Datum {
  sumInterestPaidSoFar: number;
  sumPaidSoFar: number;
}

export interface DebtSerieSelectorResult {
  resolution: "Month" | "Year";
  restSerie: Datum[];
  restSerieNotAggregated: Datum[];
  serie: DebtDatum[];
  debtRestIntersection: number;
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

    const restSerie: Datum[] = [{ x: 0, y: 0 }];

    let month = 1;
    let sumDebtSoFar = BigNumber.BigNumber(sumDebt);
    let terminFunctions = allDebt.reduce((map, d) => {
      map[d.id] = buildTerminFunction(d);
      return map;
    }, {});
    let debtSoFar: Debt[] = allDebt.map(toDebt);
    let sumRestSoFar = BigNumber.BigNumber(0);
    let allEvents: PaymentPlanEvent[] = [];
    let debtRestIntersection = -1;

    while (sumDebtSoFar.isGreaterThan(0) && month <= MAX_MONTHS) {
      const { newDebt, events, rest } = advanceDebt(
        debtSoFar,
        terminFunctions,
        useTowardsDebt,
        month
      );
      debtSoFar = newDebt;
      allEvents = [...allEvents, ...events];
      sumRestSoFar = sumRestSoFar.plus(rest);
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

      if (debtRestIntersection === -1 && sumRestSoFar.isGreaterThan(sumDebtSoFar)) {
        debtRestIntersection = month;
      }

      serie.push({
        x: month,
        y: sumDebtSoFar.integerValue().toNumber(),
        sumInterestPaidSoFar: sumInterestPaidSoFar.integerValue().toNumber(),
        sumPaidSoFar: sumPaidSoFar.integerValue().toNumber(),
      });

      restSerie.push({ x: month, y: sumRestSoFar.integerValue().toNumber() });

      month++;
    }

    if (serie.length >= 12 * 5) {
      return {
        resolution: "Year",
        events: allEvents,
        debtRestIntersection,
        restSerieNotAggregated: restSerie,
        restSerie: restSerie
          .filter((_, i) => {
            return i % 12 === 0 || i === serie.length - 1;
          })
          .map((datum, i) => ({
            ...datum,
            x: i,
          })),
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
      events: allEvents,
      debtRestIntersection,
      restSerieNotAggregated: restSerie,
      restSerie,
      serie,
    };
  }
);

function advanceDebt(
  currentDebt: Debt[],
  terminFunctions: { [key: string]: TerminFunction },
  moneyToDistribute: BigNumber.BigNumber,
  month: number
): {
  events: PaymentPlanEvent[];
  newDebt: Debt[];
  rest: BigNumber.BigNumber;
} {
  if (currentDebt.length === 0) {
    return {
      events: [],
      newDebt: [],
      rest: moneyToDistribute,
    };
  }
  let rest = moneyToDistribute;
  const events: PaymentPlanEvent[] = [];

  return {
    newDebt: currentDebt.map((debt) => {
      if (debt.processed.remaining.isEqualTo(0)) {
        return debt;
      }

      const terminResult = terminFunctions[debt.initial.id](debt, rest);
      const { terminAmount, interestAmount, newDebt, newRest } = terminResult;

      const processed = {
        paidSoFar: debt.processed.paidSoFar.plus(terminAmount),
        remaining: newDebt,
        interestPaidSoFar: debt.processed.interestPaidSoFar.plus(interestAmount),
      };

      const updatedDebt: Debt = {
        ...debt,
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
    rest,
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
        .plus(debt.fee)
        .integerValue(BigNumber.BigNumber.ROUND_UP);

      return ({ processed: { remaining } }: Debt, moneyToDistribute: BigNumber.BigNumber) => {
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
        };
      };
    }
    case "annuity":
      const targetTerminAmount = monthlyInterest
        .dividedBy(one.minus(one.plus(monthlyInterest).pow(-debt.termins)))
        .multipliedBy(debt.amount)
        .plus(debt.fee)
        .integerValue(BigNumber.BigNumber.ROUND_UP);

      return ({ processed: { remaining } }: Debt, moneyToDistribute: BigNumber.BigNumber) => {
        const interestAmount = interest.dividedBy(12).multipliedBy(remaining).decimalPlaces(2);
        const terminAmount = BigNumber.BigNumber.min(
          targetTerminAmount,
          remaining.plus(interestAmount).plus(debt.fee)
        );
        const principalAmount = terminAmount.minus(interestAmount).minus(debt.fee);
        const canPay = moneyToDistribute.isGreaterThanOrEqualTo(terminAmount);

        if (!canPay) {
          return {
            terminAmount: BigNumber.BigNumber(0),
            interestAmount: BigNumber.BigNumber(0),
            principalAmount: BigNumber.BigNumber(0),
            newDebt: remaining.plus(interestAmount).plus(debt.fee),
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
          interestAmount: terminAmount.isZero() ? BigNumber.BigNumber(0) : interestAmount,
          principalAmount: BigNumber.BigNumber.max(principalAmount, 0),
          newDebt,
          newRest,
        };
      };
    }
  }
}

function toDebt(debt: DebtState): Debt {
  return {
    initial: debt,
    history: [],
    processed: {
      interestPaidSoFar: BigNumber.BigNumber(0),
      paidSoFar: BigNumber.BigNumber(0),
      remaining: BigNumber.BigNumber(debt.amount),
    },
  };
}

function buildTerminFunction(debt: DebtState) {
  const interest = BigNumber.BigNumber(debt.interest).dividedBy(100);

  return getTerminFunction(debt, interest);
}
