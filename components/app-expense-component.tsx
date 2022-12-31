import Delete from "@mui/icons-material/Delete";
import { debounce } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
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
    <div className="relative">
      <div className="m-2 flex flex-row flex-wrap justify-center lg:justify-start">
        <Autocomplete
          id="expenseName"
          freeSolo={true}
          sx={{ width: 200 }}
          className="m-2 shrink-0 grow-0 inline-flex"
          options={[
            "Food",
            "Transportation",
            "Travel",
            "Vacation",
            "Living",
            "Clothes",
            "Other",
            "Hobby",
            "Savings",
            "Stocks",
            "Children",
            "Alcohol",
            "Medicine",
            "Household",
            "Internet",
            "Electricity",
          ]}
          inputValue={name}
          onInputChange={(_, newName) => setName(newName)}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="Expense" />
          )}
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
