import Add from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { Stack } from "@mui/system";
import { nanoid } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { addExpense, selectAllExpenses } from "../store/expense-slice";
import { useAppSelector } from "../store/store";
import AppExpenseComponent, { allOptions } from "./app-expense-component";

export default function AppExpensesComponent() {
  const dispatch = useDispatch();
  const allExpenses = useAppSelector(selectAllExpenses);

  const nextOptionKey: string = useMemo(
    () =>
      Object.keys(allOptions).filter(
        (key) => !allExpenses.find((e) => e.name === key)
      )[0] || "",
    [allExpenses]
  );

  return (
    <Stack spacing={0} divider={<Divider />}>
      {allExpenses.map((expense) => (
        <AppExpenseComponent key={expense.id} expense={expense} />
      ))}
      <IconButton
        onClick={() => {
          dispatch(
            addExpense({
              id: nanoid(),
              name: nextOptionKey,
              amount: nextOptionKey
                ? allOptions[nextOptionKey].defaultAmount
                : 0,
            })
          );
        }}
      >
        <Add />
      </IconButton>
    </Stack>
  );
}
