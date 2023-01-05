import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "./store";

export interface DebtInsightNavigationState {
  activeTab: number;
  openTips: { [key: string]: boolean };
}

const initialState: DebtInsightNavigationState = {
  activeTab: 0,
  openTips: {},
};

export const debtInsightSlice = createSlice({
  name: "debtInsight",
  initialState,
  reducers: {
    updateNavigation: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setOpenTips: (state, action) => {
      return {
        ...state,
        openTips: {
          ...action.payload,
        },
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

export const { updateNavigation, setOpenTips } = debtInsightSlice.actions;

export const selectActiveTab = (state: AppState) => state.debtInsight.activeTab;
export const selectOpenTips = (state: AppState) => state.debtInsight.openTips;

export default debtInsightSlice.reducer;
