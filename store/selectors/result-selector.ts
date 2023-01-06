import { createSelector } from "@reduxjs/toolkit";
import * as BigNumber from "bignumber.js";
import { selectSumExpense } from "../expense-slice";
import { selectSumIncome } from "../income-slice";
import { selectResultSpending } from "../result-spending-slice";

export const selectResult = createSelector(
  [selectSumIncome, selectSumExpense],
  (income, expense) => income - expense
);

export const selectUseTowardsDebt = createSelector(
  [selectResult, selectResultSpending],
  (result, { useTowardsDebt, useTowardsDebtType }) =>
    useTowardsDebtType === "number"
      ? BigNumber.BigNumber(useTowardsDebt)
      : BigNumber.BigNumber(useTowardsDebt).multipliedBy(result).dividedBy(100)
);
