import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useMemo } from "react";
import { selectAllDebts } from "../store/debt-slice";
import { selectAllExpenses } from "../store/expense-slice";
import { selectAllIncomes } from "../store/income-slice";
import { useAppSelector } from "../store/store";
import AppDebtsComponent from "./app-debts-component";
import AppExpensesComponent from "./app-expenses-component";
import AppIncomesComponent from "./app-incomes-component";

export default function AppUserInputComponent() {
  const incomes = useAppSelector(selectAllIncomes);
  const expenses = useAppSelector(selectAllExpenses);
  const debts = useAppSelector(selectAllDebts);

  const sumIncome = useMemo(
    () => incomes.reduce((sum, i) => (sum += i.amount), 0),
    [incomes]
  );
  const sumExpense = useMemo(
    () => expenses.reduce((sum, e) => (sum += e.amount), 0),
    [expenses]
  );

  const sumDebt = useMemo(
    () => debts.reduce((sum, d) => (sum += d.amount), 0),
    [debts]
  );

  return (
    <div>
      <Accordion defaultExpanded={true}>
        <AccordionSummary>
          <div className="flex justify-between w-full">
            <div>Income</div>
            <div>{sumIncome},-</div>
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
            <div>{sumExpense},-</div>
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
            <div>{sumDebt},-</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <AppDebtsComponent />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
