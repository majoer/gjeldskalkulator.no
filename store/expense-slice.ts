import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
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
    updateExpense: expenseAdapter.updateOne,
    removeExpense: expenseAdapter.removeOne,
    setAllExpenses: expenseAdapter.setAll,
  },
  extraReducers: {
    [HYDRATE]: (state: any, action: any): any => {
      return {
        ...state,
      };
    },
  },
});

export const { addExpense, updateExpense, removeExpense, setAllExpenses } =
  expenseSlice.actions;

export const { selectAll: selectAllExpenses } =
  expenseAdapter.getSelectors<AppState>((state: AppState) => state.expenses);

export const selectSumExpense = createSelector(
  [selectAllExpenses],
  (expenses) => expenses.reduce((sum, e) => (sum += e.amount), 0)
);

export default expenseSlice.reducer;
