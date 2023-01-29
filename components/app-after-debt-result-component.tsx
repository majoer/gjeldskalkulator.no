import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import {
  MAX_MONTHS,
  selectDebtSeries,
  selectTotalCostOfDebt,
} from "../store/selectors/graph-selector";
import { useAppSelector } from "../store/store";

export default function AppAfterDebtResultComponent() {
  const { t } = useTranslation(["calculator"]);
  const { serie, resolution, debtRestIntersection } = useAppSelector(selectDebtSeries);
  const router = useRouter();
  const totalCost = useAppSelector(selectTotalCostOfDebt);

  const endDate = useMemo(() => {
    if (serie.length === 1) {
      return undefined;
    }
    const formatter = new Intl.DateTimeFormat(router.locale, {
      month: "long",
      year: "numeric",
    });

    const today = new Date();
    const dataPoints = serie.length - 1;
    const monthsLeft = resolution === "Month" ? dataPoints : dataPoints * 12;
    const done = new Date(today.setMonth(today.getMonth() + monthsLeft));

    return formatter.format(done);
  }, [serie, t]);

  const earliestEndDate = useMemo(() => {
    if (debtRestIntersection === -1) {
      return undefined;
    }
    const formatter = new Intl.DateTimeFormat(router.locale, {
      month: "long",
      year: "numeric",
    });

    const today = new Date();
    const done = new Date(today.setMonth(today.getMonth() + debtRestIntersection));

    return formatter.format(done);
  }, [debtRestIntersection, t]);

  return (
    <div>
      <ul>
        <li>
          <Typography>
            {totalCost === -1
              ? t("calculator:chart.totalCost.tooMuch")
              : totalCost === -2
              ? t("calculator:chart.totalCost.infinity")
              : t("calculator:chart.totalCost.result", {
                  value: totalCost,
                })}
          </Typography>
        </li>
        <li>
          <Typography>
            {totalCost === -1
              ? t("calculator:chart.remainingTime.tooMuch", {
                  value: Math.floor(MAX_MONTHS / 12),
                })
              : totalCost === -2
              ? t("calculator:chart.remainingTime.infinity")
              : !endDate
              ? t("calculator:chart.remainingTime.noData")
              : t("calculator:chart.remainingTime.result", {
                  value: endDate,
                })}
          </Typography>
        </li>
        {earliestEndDate !== endDate ? (
          <li>
            <Typography>
              {t("calculator:chart.remainingTime.repayEarly", {
                value: earliestEndDate,
              })}
            </Typography>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
