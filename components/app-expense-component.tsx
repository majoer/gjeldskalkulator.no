import Delete from "@mui/icons-material/Delete";
import { debounce } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useCallback, useEffect, useState } from "react";
import {
  ExpenseState,
  removeExpense,
  updateExpense,
} from "../store/expense-slice";
import { useAppDispatch } from "../store/store";

export interface AppExpenseProps {
  expense: ExpenseState;
}

export default function AppExpenseComponent({ expense }: AppExpenseProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState(expense.amount);
  const { id } = expense;

  const debouncedUpdate = useCallback(
    debounce((changes: Partial<ExpenseState>) => {
      dispatch(updateExpense({ id, changes }));
    }, 600),
    []
  );

  useEffect(() => {
    debouncedUpdate({ name, amount });
  }, [name, amount]);

  return (
    <div>
      <div className="flex relative">
        <TextField
          id="name"
          className="m-2 shrink-0 grow-0"
          label="Name"
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="amount"
          className="m-2 shrink-0 grow-0"
          label="Amount"
          variant="standard"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value, 10))}
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <IconButton onClick={() => dispatch(removeExpense(id))}>
            <Delete />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
