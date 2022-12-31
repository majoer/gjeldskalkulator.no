import Delete from "@mui/icons-material/Delete";
import { debounce } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { BigNumber } from "bignumber.js";
import { DebtState, removeDebt, updateDebt } from "../store/debt-slice";
import { useAppDispatch } from "../store/store";
import { useCallback, useState } from "react";
import { useEffect } from "react";

export interface AppLoanProps {
  debt: DebtState;
}

export default function AppDebtComponent({ debt }: AppLoanProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(debt.name);
  const [amount, setAmount] = useState(debt.amount);
  const [interest, setInterest] = useState(debt.interest);
  const [fee, setFee] = useState(debt.fee);
  const { id } = debt;

  const debouncedUpdate = useCallback(
    debounce((changes: Partial<DebtState>) => {
      dispatch(updateDebt({ id, changes }));
    }, 600),
    []
  );

  useEffect(() => {
    debouncedUpdate({ name, amount, interest, fee });
  }, [name, amount, interest, fee]);

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
          className="m-2 shrink-0 grow-0"
          label="Amount"
          variant="standard"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value, 10))}
        />
        <TextField
          id="interest"
          className="m-2 shrink-0 grow-0"
          label="Interest (%)"
          variant="standard"
          type="number"
          value={interest.multipliedBy(100)}
          onChange={(e) =>
            setInterest(BigNumber(e.target.value).dividedBy(100))
          }
        />
        <TextField
          id="fee"
          className="m-2 shrink-0 grow-0"
          label="Fee"
          variant="standard"
          type="number"
          value={fee}
          onChange={(e) => setFee(parseInt(e.target.value, 10))}
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
