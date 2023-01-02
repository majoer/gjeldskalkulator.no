import Delete from "@mui/icons-material/Delete";
import { debounce } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IncomeState, removeIncome, updateIncome } from "../store/income-slice";
import { useAppDispatch } from "../store/store";
import { positiveInteger } from "../validation/validation";

export interface AppIncomeProps {
  income: IncomeState;
}

export default function AppIncomeComponent({ income }: AppIncomeProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(income.name);
  const [amount, setAmount] = useState("" + income.amount);
  const { id } = income;

  const errors = useMemo(
    () => ({
      name: undefined,
      amount: positiveInteger(amount),
    }),
    [name, amount]
  );

  const debouncedUpdate = useCallback(
    debounce(({ name, amount, errors }) => {
      const fullUpdate: Partial<IncomeState> = {
        name,
        amount: parseInt(amount, 10),
      };

      const changes: Partial<IncomeState> = Object.keys(errors)
        .filter((field) => !errors[field])
        .reduce((update, field) => {
          update[field] = fullUpdate[field];
          return update;
        }, {});

      dispatch(updateIncome({ id, changes }));
    }, 600),
    []
  );

  useEffect(() => {
    debouncedUpdate({ name, amount, errors });
  }, [name, amount, errors]);

  return (
    <div className="relative">
      <div className="m-2 flex flex-row flex-wrap justify-center lg:justify-start">
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
          type="text"
          label="Amount"
          variant="standard"
          className="m-2 shrink-0 grow-0"
          value={amount}
          error={!!errors["amount"]}
          helperText={errors["amount"]}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <IconButton onClick={() => dispatch(removeIncome(id))}>
            <Delete />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
