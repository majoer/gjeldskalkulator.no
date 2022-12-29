import { createSelector } from "@reduxjs/toolkit";
import { selectSumExpense } from "../expense-slice";
import { selectSumIncome } from "../income-slice";

export const selectResult = createSelector(
  [selectSumIncome, selectSumExpense],
  (income, expense) => income - expense
);
