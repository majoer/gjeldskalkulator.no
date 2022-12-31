import Add from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { Stack } from "@mui/system";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { addExpense, selectAllExpenses } from "../store/expense-slice";
import { useAppSelector } from "../store/store";
import AppExpenseComponent from "./app-expense-component";

export default function AppExpensesComponent() {
  const dispatch = useDispatch();
  const expenses = useAppSelector(selectAllExpenses);

  return (
    <Stack spacing={0} divider={<Divider />}>
      {expenses.map((expense) => (
        <AppExpenseComponent key={expense.id} expense={expense} />
      ))}
      <IconButton
        onClick={() => {
          dispatch(
            addExpense({
              id: nanoid(),
              amount: 10000,
              name: "Mat",
            })
          );
        }}
      >
        <Add />
      </IconButton>
    </Stack>
  );
}
