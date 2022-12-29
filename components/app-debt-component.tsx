import Delete from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { DebtState, removeDebt, updateDebt } from "../store/debt-slice";
import { useAppDispatch } from "../store/store";

export interface AppLoanProps {
  debt: DebtState;
}

export default function AppDebtComponent({ debt }: AppLoanProps) {
  const { id, name, amount, interest, fee } = debt;
  const [expanded, setExpanded] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className="relative">
      <div className="m-2 flex flex-row flex-wrap justify-center lg:justify-start">
        <TextField
          id="name"
          className="m-2 shrink-0 grow-0"
          label="Name"
          variant="standard"
          value={name}
          onChange={(e) =>
            dispatch(
              updateDebt({
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
              updateDebt({
                id,
                changes: {
                  amount: parseInt(e.target.value, 10),
                },
              })
            )
          }
        />
        <TextField
          id="interest"
          className="m-2 shrink-0 grow-0"
          label="Interest (%)"
          variant="standard"
          type="number"
          value={interest}
          onChange={(e) =>
            dispatch(
              updateDebt({
                id,
                changes: {
                  interest: parseFloat(e.target.value),
                },
              })
            )
          }
        />
        <TextField
          id="fee"
          className="m-2 shrink-0 grow-0"
          label="Fee"
          variant="standard"
          type="number"
          value={fee}
          onChange={(e) =>
            dispatch(
              updateDebt({
                id,
                changes: {
                  fee: parseInt(e.target.value, 10),
                },
              })
            )
          }
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
