import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "./store";

export interface ResultSpendingState {
  useTowardsDebt: number;
  useTowardsDebtType: "percentage" | "number";
}

const initialState: ResultSpendingState = {
  useTowardsDebt: 80,
  useTowardsDebtType: "percentage",
};

export const resultSpendingSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    updateResultSpending: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  extraReducers: {
    [HYDRATE]: (state: any, action: any): any => {
      return {
        ...state,
      };
    },
  },
});

export const { updateResultSpending } = resultSpendingSlice.actions;

export const selectResultSpending = (state: AppState) => state.result;

export default resultSpendingSlice.reducer;
