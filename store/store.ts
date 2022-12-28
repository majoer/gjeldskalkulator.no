import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { debtSlice } from "./debt-slice";
import { expenseSlice } from "./expense-slice";
import { incomeSlice } from "./income-slice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    [debtSlice.name]: debtSlice.reducer,
    [expenseSlice.name]: expenseSlice.reducer,
    [incomeSlice.name]: incomeSlice.reducer,
  },
  devTools: true,
});

const makeStore = () => store;

export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
