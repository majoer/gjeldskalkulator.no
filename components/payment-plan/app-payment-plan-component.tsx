import ExpandMore from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import { updateNavigation } from "../../store/debt-insight-slice";
import { selectAllDebts } from "../../store/debt-slice";
import { selectAllIncomes } from "../../store/income-slice";
import { selectDebtSeries, selectTotalCostOfDebt } from "../../store/selectors/graph-selector";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { TAB_TIPS } from "../app-debt-insight";
import AppPaymentPlanTableComponent from "./app-payment-plan-table-component";

export default function AppPaymentPlanComponent() {
  const { t } = useTranslation(["calculator"]);
  const { paymentPlan, events } = useAppSelector(selectDebtSeries);
  const dispatch = useAppDispatch();
  const allDebts = useAppSelector(selectAllDebts);
  const allIncomes = useAppSelector(selectAllIncomes);
  const totalCost = useAppSelector(selectTotalCostOfDebt);

  const relevantEvents = useMemo(
    () => events.filter(({ type }) => type === "DEBT_PAID_OFF"),
    [events]
  );

  if (relevantEvents.length !== allDebts.length) {
    return (
      <div>
        <Typography>{t("calculator:paymentPlan.noEvents.default")}</Typography>
        <ul>
          {allIncomes.length === 0 ? (
            <li>
              <Typography>{t("calculator:paymentPlan.noEvents.reason.addIncome")}</Typography>
            </li>
          ) : null}
          {allDebts.length === 0 ? (
            <li>
              <Typography>{t("calculator:paymentPlan.noEvents.reason.addDebt")}</Typography>
            </li>
          ) : null}
          {allIncomes.length > 0 && allDebts.length > 0 && totalCost < 0 ? (
            <li>
              <Button onClick={() => dispatch(updateNavigation({ activeTab: TAB_TIPS }))}>
                {t("calculator:paymentPlan.noEvents.reason.impossible")}
              </Button>
            </li>
          ) : null}
        </ul>
      </div>
    );
  }

  return (
    <div>
      {relevantEvents.map((event, i) => (
        <Accordion key={i} TransitionProps={{ unmountOnExit: true }}>
          <AccordionSummary expandIcon={<ExpandMore />} className="flex-row-reverse">
            <div className="flex flex-row justify-between w-full ml-3">
              <span>
                {dayjs().add(event.month, "months").format("YYYY.MM")} -{" "}
                {t("calculator:paymentPlan.eventHeader.loanCompleted", {
                  value: event.debt.initial.name,
                })}
              </span>
              <span>{event.debt.processed.paidSoFar.integerValue().toNumber()},-</span>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <AppPaymentPlanTableComponent debtHistory={event.debt.history} />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
