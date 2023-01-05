import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useMemo } from "react";
import { selectSumDebt } from "../store/debt-slice";
import { selectSumExpense } from "../store/expense-slice";
import { selectSumIncome } from "../store/income-slice";
import { useAppSelector } from "../store/store";
import AppDebtsComponent from "./app-debts-component";
import AppExpensesComponent from "./app-expenses-component";
import AppIncomesComponent from "./app-incomes-component";
import AppResultSpendingComponent from "./app-result-spending-component";
import { selectResult } from "../store/selectors/result-selector";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function AppUserInputComponent() {
  const sumIncome = useAppSelector(selectSumIncome);
  const sumExpense = useAppSelector(selectSumExpense);
  const sumDebt = useAppSelector(selectSumDebt);
  const result = useAppSelector(selectResult);

  const resultClassName = useMemo(
    () =>
      result >= 2000
        ? "bg-blue-50"
        : result >= 0
        ? "bg-yellow-50"
        : "bg-red-50",
    [result]
  );

  return (
    <div>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          className="flex-row-reverse"
          expandIcon={<ExpandMore />}
        >
          <div className="flex justify-between ml-3 w-full">
            <div>Income</div>
            <div>{sumIncome},-</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <AppIncomesComponent />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          className="flex-row-reverse"
          expandIcon={<ExpandMore />}
        >
          <div className="flex justify-between ml-3 w-full">
            <div>Expense</div>
            <div>{sumExpense},-</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <AppExpensesComponent />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false} className={resultClassName}>
        <AccordionSummary
          className="flex-row-reverse"
          expandIcon={<ExpandMore />}
        >
          <div className="flex justify-between ml-3 w-full">
            <div>Result</div>
            <div>{result},-</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <AppResultSpendingComponent />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          className="flex-row-reverse"
          expandIcon={<ExpandMore />}
        >
          <div className="flex justify-between ml-3 w-full">
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
