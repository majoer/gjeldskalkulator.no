import Delete from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
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
  const { id, amount, name } = expense;
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className="flex relative">
        <TextField
          id="name"
          className="m-2 shrink-0 grow-0"
          label="Name"
          variant="standard"
          value={name}
          onChange={(e) =>
            dispatch(
              updateExpense({
                id,
                changes: {
                  name: e.target.value,
                },
              })
            )
          }
        />
        <TextField
          id="amount"
          className="m-2 shrink-0 grow-0"
          label="Amount"
          variant="standard"
          type="number"
          value={amount}
          onChange={(e) =>
            dispatch(
              updateExpense({
                id,
                changes: {
                  amount: parseInt(e.target.value, 10),
                },
              })
            )
          }
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