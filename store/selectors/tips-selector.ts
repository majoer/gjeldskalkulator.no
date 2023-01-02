import { createSelector } from "@reduxjs/toolkit";
import { allTips, ResolvedTip } from "../../components/app-tips-component";
import { selectAllExpenses } from "../expense-slice";
import { selectAllIncomes } from "../income-slice";
import { selectTotalCostOfDebt } from "./graph-selector";
import { selectResult, selectUseTowardsDebt } from "./result-selector";

export interface SelectTipsResult {
  allRelevantTips: ResolvedTip[];
  tipIdMap: { [key: string]: ResolvedTip };
}

export const selectTips = createSelector(
  [
    selectAllIncomes,
    selectAllExpenses,
    selectUseTowardsDebt,
    selectResult,
    selectTotalCostOfDebt,
  ],
  (
    allIncomes,
    allExpenses,
    useTowardsDebt,
    result,
    totalCostOfDebt
  ): SelectTipsResult => {
    const userStarted = allExpenses.length > 0 && allIncomes.length > 0;

    if (!userStarted) {
      return {
        allRelevantTips: [],
        tipIdMap: {},
      };
    }

    const incomeMap = allIncomes.reduce(
      (map, i) => map.set(i.name, i),
      new Map()
    );

    const expenseMap = allExpenses.reduce(
      (map, e) => map.set(e.name, e),
      new Map()
    );

    const allRelevantTips = allTips
      .map((tip) => ({
        ...tip,
        condition: tip.condition({
          incomeMap,
          expenseMap,
          useTowardsDebt,
          result,
          totalCostOfDebt,
        }),
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
