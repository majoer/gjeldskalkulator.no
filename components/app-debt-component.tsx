import Delete from "@mui/icons-material/Delete";
import { debounce } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DebtState, removeDebt, updateDebt } from "../store/debt-slice";
import { useAppDispatch } from "../store/store";
import {
  naturalNumber,
  positiveInteger,
  positiveNumber,
} from "../validation/validation";

export interface AppLoanProps {
  debt: DebtState;
}

export default function AppDebtComponent({ debt }: AppLoanProps) {
  const { t } = useTranslation(["calculator"]);
  const dispatch = useAppDispatch();
  const [name, setName] = useState(debt.name);
  const [amount, setAmount] = useState("" + debt.amount);
  const [interest, setInterest] = useState(debt.interest);
  const [fee, setFee] = useState("" + debt.fee);
  const { id } = debt;

  const errors = useMemo(
    () => ({
      name: undefined,
      amount: positiveInteger(amount),
      interest: positiveNumber(interest),
      fee: naturalNumber(fee),
    }),
    [name, amount, interest, fee]
  );

  const debouncedUpdate = useCallback(
    debounce(({ name, amount, interest, fee, errors }) => {
      const fullUpdate: Partial<DebtState> = {
        name,
        amount: parseInt(amount, 10),
        interest,
        fee: parseInt(fee, 10),
      };

      const changes: Partial<DebtState> = Object.keys(errors)
        .filter((field) => !errors[field])
        .reduce((update, field) => {
          update[field] = fullUpdate[field];
          return update;
        }, {});

      dispatch(updateDebt({ id, changes }));
    }, 600),
    []
  );

  useEffect(() => {
    debouncedUpdate({ name, amount, interest, fee, errors });
  }, [name, amount, interest, fee, errors]);

  return (
    <div className="relative py-4 sm:py-1">
      <div className="sm:m-2 w-3/4 flex flex-col sm:flex-row flex-wrap">
        <TextField
          id="name"
          type="text"
          label={t("calculator:debt.name.label")}
          variant="standard"
          className="m-2 shrink-0 grow-0"
          value={name}
          error={!!errors["name"]}
          helperText={t(errors["name"])}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="amount"
          type="text"
          label={t("calculator:debt.amount.label")}
          variant="standard"
          className="m-2 shrink-0 grow-0"
          inputProps={{ pattern: "\\d*" }}
          value={amount}
          error={!!errors["amount"]}
          helperText={t(errors["amount"])}
          onChange={(e) => setAmount(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className="absolute right-0">
                <div>kr</div>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="interest"
          type="text"
          label={t("calculator:debt.interest.label")}
          variant="standard"
          className="m-2 shrink-0 grow-0"
          inputProps={{ pattern: "\\d*" }}
          value={interest}
          error={!!errors["interest"]}
          helperText={t(errors["interest"])}
          onChange={(e) => setInterest(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className="absolute right-0">
                <div>%</div>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="fee"
          type="text"
          label={t("calculator:debt.fee.label")}
          variant="standard"
          className="m-2 shrink-0 grow-0"
          inputProps={{ pattern: "\\d*" }}
          value={fee}
          error={!!errors["fee"]}
          helperText={t(errors["fee"])}
          onChange={(e) => setFee(e.target.value)}
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
            title={t("calculator:debt.remove.title")}
            onClick={() => dispatch(removeDebt(id))}
          >
            <Delete />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
