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
import { useTranslation } from "next-i18next";
import AppTipButtonComponent from "./tip/app-tip-button-component";
import { selectTips } from "../store/selectors/tips-selector";
import AppAfterDebtResultComponent from "./app-after-debt-result-component";
import {
  PLAN_BLOWS_TO_INFINITY,
  selectDebtSeries,
  selectTotalCostOfDebt,
} from "../store/selectors/graph-selector";

export default function AppUserInputComponent() {
  const { t } = useTranslation(["calculator"]);
  const sumIncome = useAppSelector(selectSumIncome);
  const sumExpense = useAppSelector(selectSumExpense);
  const sumDebt = useAppSelector(selectSumDebt);
  const result = useAppSelector(selectResult);
  const { tipIdMap } = useAppSelector(selectTips);
  const totalCost = useAppSelector(selectTotalCostOfDebt);
  const { restSerie } = useAppSelector(selectDebtSeries);

  const resultClassName = useMemo(
    () => (result >= 2000 ? "bg-blue-50" : result >= 0 ? "bg-yellow-50" : "bg-red-50"),
    [result]
  );

  const summaryClassName = useMemo(() => (totalCost < 0 ? "bg-red-50" : "bg-blue-50"), [totalCost]);

  return (
    <div>
      <Accordion defaultExpanded={true}>
        <AccordionSummary className="flex-row-reverse" expandIcon={<ExpandMore />}>
          <div className="flex justify-between ml-3 w-full">
            <div>{t("calculator:userInput.income")}</div>
            <div>{sumIncome},-</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <AppIncomesComponent />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary className="flex-row-reverse" expandIcon={<ExpandMore />}>
          <div className="flex justify-between ml-3 w-full">
            <div>{t("calculator:userInput.expense")}</div>
            <div>{sumExpense},-</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <AppExpensesComponent />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false} className={resultClassName}>
        <AccordionSummary className="flex-row-reverse" expandIcon={<ExpandMore />}>
          <div className="flex justify-between ml-3 w-full">
            <div>{t("calculator:userInput.resultBeforeDebt")}</div>
            <div>{result},-</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <AppResultSpendingComponent />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary className="flex-row-reverse" expandIcon={<ExpandMore />}>
          <div className="flex justify-between ml-3 w-full">
            <div>
              {t("calculator:userInput.debt")}
              {tipIdMap["refinanceDebt"] ? <AppTipButtonComponent id={"refinanceDebt"} /> : null}
            </div>
            <div>{sumDebt},-</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <AppDebtsComponent />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true} className={summaryClassName}>
        <AccordionSummary className="flex-row-reverse" expandIcon={<ExpandMore />}>
          <div className="flex justify-between ml-3 w-full">
            <div>{t("calculator:userInput.unspent")}</div>
            <div>{restSerie[restSerie.length - 1].y as number},-</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <AppAfterDebtResultComponent />
        </AccordionDetails>
      </Accordion>
      <div className="h-2"></div>
    </div>
  );
}
