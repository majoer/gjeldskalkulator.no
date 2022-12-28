import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "./store";

export interface ExpenseState {
  id: string;
  name: string;
  amount: number;
}

export const expenseAdapter = createEntityAdapter<ExpenseState>({
  selectId: (liability) => liability.id,
});
const initialEmptyState = expenseAdapter.getInitialState({});
const initialState = [];

export const expenseSlice = createSlice({
  name: "expenses",
  initialState: expenseAdapter.addMany(initialEmptyState, initialState),
  reducers: {
    addExpense: expenseAdapter.addOne,
    removeExpense: expenseAdapter.removeOne,
  },
  extraReducers: {
    [HYDRATE]: (state: any, action: any): any => {
      return {
        ...state,
      };
    },
  },
});

export const { addExpense, removeExpense } = expenseSlice.actions;

export const { selectAll: selectAllExpenses } =
  expenseAdapter.getSelectors<AppState>((state) => state.expenses);

export default expenseSlice.reducer;
