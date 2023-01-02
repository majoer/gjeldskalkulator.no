import Delete from "@mui/icons-material/Delete";
import { debounce } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { BigNumber } from "bignumber.js";
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
  const dispatch = useAppDispatch();
  const [name, setName] = useState(debt.name);
  const [amount, setAmount] = useState("" + debt.amount);
  const [interest, setInterest] = useState(
    "" + debt.interest.multipliedBy(100)
  );
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
        interest: BigNumber(interest).dividedBy(100),
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
    <div className="relative">
      <div className="m-2 flex flex-row flex-wrap justify-center lg:justify-start">
        <TextField
          id="name"
          type="text"
          label="Name"
          variant="standard"
          className="m-2 shrink-0 grow-0"
          value={name}
          error={!!errors["name"]}
          helperText={errors["name"]}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="amount"
          type="text"
          label="Amount"
          variant="standard"
          className="m-2 shrink-0 grow-0"
          inputProps={{ pattern: "\\d*" }}
          value={amount}
          error={!!errors["amount"]}
          helperText={errors["amount"]}
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          id="interest"
          type="text"
          label="Interest (%)"
          variant="standard"
          className="m-2 shrink-0 grow-0"
          inputProps={{ pattern: "\\d*" }}
          value={interest}
          error={!!errors["interest"]}
          helperText={errors["interest"]}
          onChange={(e) => setInterest(e.target.value)}
        />
        <TextField
          id="fee"
          type="text"
          label="Fee"
          variant="standard"
          className="m-2 shrink-0 grow-0"
          inputProps={{ pattern: "\\d*" }}
          value={fee}
          error={!!errors["fee"]}
          helperText={errors["fee"]}
          onChange={(e) => setFee(e.target.value)}
        />

        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <IconButton onClick={() => dispatch(removeDebt(id))}>
            <Delete />
          </IconButton>
        </div>
      </div>
      {/* <Accordion className="w-full" expanded={expanded}>
          <AccordionSummary className="h-0"></AccordionSummary>
          <AccordionDetails>Secret</AccordionDetails>
        </Accordion> */}
    </div>
  );
}
