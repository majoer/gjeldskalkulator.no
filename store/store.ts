import {
  Action,
  combineReducers,
  configureStore,
  PreloadedState,
  ThunkAction,
} from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { debtInsightSlice } from "./debt-insight-slice";
import { debtSlice } from "./debt-slice";
import { expenseSlice } from "./expense-slice";
import { incomeSlice } from "./income-slice";
import { resultSpendingSlice } from "./result-spending-slice";

const rootReducer = combineReducers({
  [debtSlice.name]: debtSlice.reducer,
  [expenseSlice.name]: expenseSlice.reducer,
  [incomeSlice.name]: incomeSlice.reducer,
  [resultSpendingSlice.name]: resultSpendingSlice.reducer,
  [debtInsightSlice.name]: debtInsightSlice.reducer,
});

export const setupStore = (preloadedState?: PreloadedState<AppState>) => {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
    preloadedState,
  });
};

export const store = setupStore();

const makeStore = () => store;

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
