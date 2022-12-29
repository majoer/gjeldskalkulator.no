import TextField from "@mui/material/TextField";
import { selectSumExpense } from "../store/expense-slice";
import { selectSumIncome } from "../store/income-slice";
import { useAppSelector } from "../store/store";
import { useMemo } from "react";

export default function AppResultComponent() {
  const sumIncome = useAppSelector(selectSumIncome);
  const sumExpense = useAppSelector(selectSumExpense);
  const result = useMemo(() => sumIncome - sumExpense, [sumIncome, sumExpense]);
  const resultTowardsDebt = result > 0 ? result : 0;

  return (
    <div>
      <TextField
        id="result"
        className="m-2 shrink-0 grow-0"
        label="Use for Debt payments"
        variant="standard"
        value={resultTowardsDebt}
      />
    </div>
  );
}
