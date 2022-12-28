import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
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

export const { addIncome, removeIncome } = incomeSlice.actions;

export const { selectAll: selectAllIncomes } =
  incomeAdapter.getSelectors<AppState>((state) => state.incomes);

export default incomeSlice.reducer;
