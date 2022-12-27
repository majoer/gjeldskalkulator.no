import Settings from "@mui/icons-material/Settings";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useState } from "react";

export interface Loan {
  name: string;
  amount: number;
  interest: number;
}

export interface AppLoanProps {
  loan: Loan;
}

export default function AppDebtComponent({ loan }: AppLoanProps) {
  const { name, amount, interest } = loan;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      <div className="absolute top-0 right-0">
        <IconButton onClick={() => setExpanded(!expanded)}>
          <Settings />
        </IconButton>
      </div>
      <div className="m-2 flex flex-row flex-wrap justify-center lg:justify-start">
        <TextField
          id="name"
          className="m-2 shrink-0 grow-0"
          label="Name"
          variant="standard"
          value={name}
        />
        <TextField
          id="amount"
          className="m-2 shrink-0 grow-0"
          label="Amount"
          variant="standard"
          value={interest}
        />
        <TextField
          id="interest"
          className="m-2 shrink-0 grow-0"
          label="Interest (%)"
          variant="standard"
          value={amount}
        />
      </div>
      {/* <Accordion className="w-full" expanded={expanded}>
          <AccordionSummary className="h-0"></AccordionSummary>
          <AccordionDetails>Secret</AccordionDetails>
        </Accordion> */}
    </div>
  );
}
