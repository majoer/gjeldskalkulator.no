import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "./store.js";

export interface DebtState {
  id: string;
  fee: number;
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
    updateDebt: debtAdapter.updateOne,
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

export const { addDebt, updateDebt, removeDebt } = debtSlice.actions;

export const { selectAll: selectAllDebts } = debtAdapter.getSelectors<AppState>(
  (state) => state.debts
);

export const selectSumDebt = createSelector([selectAllDebts], (debts) =>
  debts.reduce((sum, d) => (sum += d.amount), 0)
);

export default debtSlice.reducer;
