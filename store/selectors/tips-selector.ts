import { createSelector } from "@reduxjs/toolkit";
import { allTips, ResolvedTip } from "../../components/app-tips-component";
import { selectAllExpenses } from "../expense-slice";
import { selectAllIncomes } from "../income-slice";

export interface SelectTipsResult {
  allRelevantTips: ResolvedTip[];
  tipIdMap: { [key: string]: ResolvedTip };
}

export const selectTips = createSelector(
  [selectAllIncomes, selectAllExpenses],
  (allIncomes, allExpenses): SelectTipsResult => {
    const incomeMap = allIncomes.reduce((map, i) => {
      map[i.name] = i;
      return map;
    }, {});

    const expenseMap = allExpenses.reduce((map, e) => {
      map[e.name] = e;
      return map;
    }, {});

    const allRelevantTips = allTips
      .map((tip) => ({
        ...tip,
        condition: tip.condition({ incomeMap, expenseMap }),
      }))
      .filter((tip) => tip.condition.active);

    const tipIdMap = allRelevantTips.reduce((map, tip) => {
      map[tip.condition.targetId] = tip;
      return map;
    }, {});

    return {
      allRelevantTips,
      tipIdMap,
    };
  }
);
