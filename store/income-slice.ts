import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "./store";

export interface IncomeState {
  id: string;
  name: string;
  amount: number;
}

export const incomeAdapter = createEntityAdapter<IncomeState>({
  selectId: (liability) => liability.id,
});
const initialEmptyState = incomeAdapter.getInitialState({});
const initialState = [];

export const incomeSlice = createSlice({
  name: "incomes",
  initialState: incomeAdapter.addMany(initialEmptyState, initialState),
  reducers: {
    addIncome: incomeAdapter.addOne,
    updateIncome: incomeAdapter.updateOne,
    removeIncome: incomeAdapter.removeOne,
  },
  extraReducers: {
    [HYDRATE]: (state: any, action: any): any => {
      return {
        ...state,
      };
    },
  },
});

export const { addIncome, updateIncome, removeIncome } = incomeSlice.actions;

export const { selectAll: selectAllIncomes } =
  incomeAdapter.getSelectors<AppState>((state) => state.incomes);

export const selectSumIncome = createSelector([selectAllIncomes], (incomes) =>
  incomes.reduce((sum, e) => (sum += e.amount), 0)
);

export default incomeSlice.reducer;
