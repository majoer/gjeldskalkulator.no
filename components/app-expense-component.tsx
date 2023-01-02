import Delete from "@mui/icons-material/Delete";
import Info from "@mui/icons-material/Info";
import { debounce } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ExpenseState,
  removeExpense,
  selectAllExpenses,
  updateExpense,
} from "../store/expense-slice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { selectTips } from "../store/selectors/tips-selector";

export interface AppExpenseProps {
  expense: ExpenseState;
}

export type ExpenseOptionName = keyof typeof allOptions;

export const allOptions = {
  Rent: { defaultAmount: 10000, synonyms: [] },
  Electricity: { defaultAmount: 3000, synonyms: [] },
  Transportation: { defaultAmount: 3000, synonyms: [] },
  Food: { defaultAmount: 5000, synonyms: [] },
  Clothes: { defaultAmount: 2000, synonyms: [] },
  Internet: { defaultAmount: 1000, synonyms: [] },
  Phone: { defaultAmount: 500, synonyms: [] },
  Streaming: { defaultAmount: 400, synonyms: [] },
  Household: { defaultAmount: 1000, synonyms: ["Living"] },
  Hobby: { defaultAmount: 500, synonyms: [] },
  Savings: { defaultAmount: 1000, synonyms: ["Stocks"] },
  Vacation: { defaultAmount: 1000, synonyms: ["Travel"] },
  Medicine: { defaultAmount: 1000, synonyms: [] },
  Living: { defaultAmount: 1000, synonyms: [] },
  Alcohol: { defaultAmount: 1000, synonyms: [] },
  "Child Support": { defaultAmount: 10000, synonyms: [] },
  Children: { defaultAmount: 10000, synonyms: [] },
  Other: { defaultAmount: 0, synonyms: [] },
};

const synonyms = Object.keys(allOptions).reduce((map, key) => {
  allOptions[key].synonyms.forEach((s) => (map[s] = key));
  return map;
}, {});

export default function AppExpenseComponent({ expense }: AppExpenseProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState(expense.amount);
  const { id } = expense;
  const { tipIdMap } = useAppSelector(selectTips);
  const allExpenses = useAppSelector(selectAllExpenses);

  const options = useMemo(
    () =>
      Object.keys(allOptions)
        .filter((key) => !allExpenses.find((e) => e.name === key))
        .flatMap((key) => allOptions[key].synonyms.concat([key]))
        .sort(),
    [allExpenses]
  );

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
          options={options}
          inputValue={name}
          onInputChange={(_, newName) =>
            setName(synonyms[newName] ? synonyms[newName] : newName)
          }
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
        {tipIdMap[id] ? (
          <Info className={tipIdMap[id].condition.color} />
        ) : null}

        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <IconButton onClick={() => dispatch(removeExpense(id))}>
            <Delete />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
