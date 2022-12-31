import Add from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { Stack } from "@mui/system";
import { nanoid } from "@reduxjs/toolkit";
import { addIncome, selectAllIncomes } from "../store/income-slice";
import { useAppSelector, useAppDispatch } from "../store/store";
import AppIncomeComponent from "./app-income-component";

export default function AppIncomesComponent() {
  const dispatch = useAppDispatch();
  const incomes = useAppSelector(selectAllIncomes);

  return (
    <Stack spacing={0} divider={<Divider />}>
      {incomes.map((income) => (
        <AppIncomeComponent key={income.id} income={income} />
      ))}
      <IconButton
        onClick={() => {
          dispatch(
            addIncome({
              id: nanoid(),
              amount: 30000,
              name: `Job ${incomes.length + 1}`,
            })
          );
        }}
      >
        <Add />
      </IconButton>
    </Stack>
  );
}
