import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "./store.js";

export interface DebtState {
  id: string;
  name: string;
  amount: number;
  interest: number;
}

export const debtAdapter = createEntityAdapter<DebtState>({
  selectId: (liability) => liability.id,
});
const initialEmptyState = debtAdapter.getInitialState({});
const initialState = [];

export const debtSlice = createSlice({
  name: "debts",
  initialState: debtAdapter.addMany(initialEmptyState, initialState),
  reducers: {
    addDebt: debtAdapter.addOne,
    removeDebt: debtAdapter.removeOne,
  },
  extraReducers: {
    [HYDRATE]: (state: any, action: any): any => {
      console.log(`hydrate ${state}`);
      return {
        ...state,
      };
    },
  },
});

export const { addDebt, removeDebt } = debtSlice.actions;

export const { selectAll: selectAllDebts } = debtAdapter.getSelectors<AppState>(
  (state) => state.debts
);

export default debtSlice.reducer;
