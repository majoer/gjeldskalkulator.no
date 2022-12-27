import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AppDebtsComponent from "./app-debts-component";

export default function AppUserInputComponent() {
  return (
    <div>
      <Accordion defaultExpanded={true}>
        <AccordionSummary>
          <div className="flex justify-between w-full">
            <div>Income</div>
            <div>35 000,-</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex">
            <TextField
              id="name"
              className="m-2 shrink-0 grow-0"
              label="Name"
              variant="standard"
              value={"Jobb 1"}
            />
            <TextField
              id="amount"
              className="m-2 shrink-0 grow-0"
              label="Amount"
              variant="standard"
              value="30000"
            />
            <IconButton>
              <Delete />
            </IconButton>
          </div>
          <div className="flex">
            <TextField
              id="name"
              className="m-2 shrink-0 grow-0"
              label="Name"
              variant="standard"
              value={"Jobb 2"}
            />
            <TextField
              id="amount"
              className="m-2 shrink-0 grow-0"
              label="Amount"
              variant="standard"
              value="5000"
            />
            <IconButton>
              <Delete />
            </IconButton>
          </div>
          <div className="text-right">
            <IconButton>
              <Add></Add>
            </IconButton>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary>
          <div className="flex justify-between w-full">
            <div>Expense</div>
            <div>11 000,-</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-col">
            <div className="flex">
              <TextField
                id="name"
                className="m-2 shrink-0 grow-0"
                label="Name"
                variant="standard"
                value={"Mat"}
              />
              <TextField
                id="amount"
                className="m-2 shrink-0 grow-0"
                label="Amount"
                variant="standard"
                value="6000"
              />
              <IconButton>
                <Delete />
              </IconButton>
            </div>
            <div className="flex">
              <TextField
                id="name"
                className="m-2 shrink-0 grow-0"
                label="Name"
                variant="standard"
                value={"Barnehage"}
              />
              <TextField
                id="amount"
                className="m-2 shrink-0 grow-0"
                label="Amount"
                variant="standard"
                value="5000"
              />
              <IconButton>
                <Delete />
              </IconButton>
            </div>
          </div>
          <div className="text-right">
            <IconButton>
              <Add></Add>
            </IconButton>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary>
          <div className="flex justify-between w-full">
            <div>Debt</div>
            <div>2 000 000,-</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <AppDebtsComponent />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
