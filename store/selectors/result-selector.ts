import { createSelector } from "@reduxjs/toolkit";
import { selectSumExpense } from "../expense-slice";
import { selectSumIncome } from "../income-slice";
import { selectResultSpending } from "../result-spending-slice";
import { selectDebtSeries } from "./graph-selector";

export const selectResult = createSelector(
  [selectSumIncome, selectSumExpense],
  (income, expense) => income - expense
);

export const selectUseTowardsDebt = createSelector(
  [selectResult, selectResultSpending],
  (result, { useTowardsDebt, useTowardsDebtType }) =>
    useTowardsDebtType === "number"
      ? Math.max(useTowardsDebt, 0)
      : Math.max((result * useTowardsDebt) / 100, 0)
);
