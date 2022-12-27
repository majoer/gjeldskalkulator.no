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

export default function AppLoanComponent({ loan }: AppLoanProps) {
  const { name, amount, interest } = loan;
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper className="m-1">
      <div className="flex flex-col relative m-4">
        <div className="m-2 flex">
          <TextField
            id="name"
            className="px-2 basis-1/4"
            label="Name"
            variant="outlined"
            value={name}
          />
          <TextField
            id="amount"
            className="px-2 basis-1/4"
            label="Amount"
            variant="outlined"
            value={interest}
          />
          <TextField
            id="interest"
            className="px-2 basis-1/4"
            label="Interest (%)"
            variant="outlined"
            value={amount}
          />
        </div>
        <div className="absolute top-0 right-0">
          <IconButton onClick={() => setExpanded(!expanded)}>
            <Settings />
          </IconButton>
        </div>
        {/* <Accordion className="w-full" expanded={expanded}>
          <AccordionSummary className="h-0"></AccordionSummary>
          <AccordionDetails>Secret</AccordionDetails>
        </Accordion> */}
      </div>
    </Paper>
  );
}
