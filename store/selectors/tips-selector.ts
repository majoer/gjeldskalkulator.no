import { createSelector } from "@reduxjs/toolkit";
import { allTips, Tip } from "../../components/app-tips-component";
import { selectAllExpenses } from "../expense-slice";
import { selectAllIncomes } from "../income-slice";

export const selectTips = createSelector(
  [selectAllIncomes, selectAllExpenses],
  (allIncomes, allExpenses): Tip[] => {
    const incomeMap = allIncomes.reduce((map, i) => {
      map[i.name] = i;
      return map;
    }, {});

    const expenseMap = allExpenses.reduce((map, e) => {
      map[e.name] = e;
      return map;
    }, {});
    return allTips.filter((tip) => tip.condition({ incomeMap, expenseMap }));
  }
);
