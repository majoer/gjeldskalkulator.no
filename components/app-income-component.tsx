import Delete from "@mui/icons-material/Delete";
import InputAdornment from "@mui/material/InputAdornment";
import { debounce } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IncomeState, removeIncome, updateIncome } from "../store/income-slice";
import { useAppDispatch } from "../store/store";
import { positiveInteger } from "../validation/validation";
import { useTranslation } from "next-i18next";

export interface AppIncomeProps {
  income: IncomeState;
}

export default function AppIncomeComponent({ income }: AppIncomeProps) {
  const { t } = useTranslation(["calculator"]);
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
    <div className="relative py-1">
      <div className="sm:m-2 w-3/4 flex flex-col sm:flex-row flex-wrap">
        <TextField
          id="name"
          className="m-2 shrink-0 grow-0"
          label={t("calculator:income.name.label")}
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="amount"
          type="text"
          label={t("calculator:income.amount.label")}
          variant="standard"
          className="m-2 shrink-0 grow-0"
          value={amount}
          error={!!errors["amount"]}
          helperText={errors["amount"]}
          onChange={(e) => setAmount(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className="absolute right-0">
                <div>kr</div>
              </InputAdornment>
            ),
          }}
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <IconButton
            color="secondary"
            title={t("calculator:income.remove.title")}
            onClick={() => dispatch(removeIncome(id))}
          >
            <Delete />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
