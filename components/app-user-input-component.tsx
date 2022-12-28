import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AppDebtsComponent from "./app-debts-component";
import AppExpensesComponent from "./app-expenses-component";
import AppIncomesComponent from "./app-incomes-component";

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
          <AppIncomesComponent />
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
          <AppExpensesComponent />
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
