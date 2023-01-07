import Paper from "@mui/material/Paper";
import { DebtDatum } from "../store/selectors/graph-selector";
import { useMemo } from "react";
import { useTranslation } from "next-i18next";

export interface AppChartTooltipComponentProps {
  datum: DebtDatum;
  resolution: "Year" | "Month";
  totalCost: number;
}

export default function AppChartTooltipComponent({
  datum: { x, y, sumInterestPaidSoFar, sumPaidSoFar },
  resolution,
  totalCost,
}: AppChartTooltipComponentProps) {
  const { t } = useTranslation(["calculator"]);

  const borderColor = useMemo(() => {
    const completePercentage = sumPaidSoFar / totalCost;
    return completePercentage < 0.4
      ? "border-red-200"
      : completePercentage < 0.6
      ? "border-yellow-200"
      : "border-blue-200";
  }, [sumPaidSoFar, totalCost]);

  return (
    <Paper className={`p-2 border-2 border-solid ${borderColor}`}>
      <div>
        {t(`calculator:chart.tooltip.resolution.${resolution}`, {
          value: x as number,
        })}
      </div>
      <div>
        {t("calculator:chart.tooltip.principalAmount", {
          value: Math.round(sumPaidSoFar - sumInterestPaidSoFar),
        })}
      </div>
      <div>
        {t("calculator:chart.tooltip.interestAmount", {
          value: Math.round(sumInterestPaidSoFar),
        })}
      </div>
      <div>
        {t("calculator:chart.tooltip.paymentAmount", {
          value: Math.round(sumPaidSoFar),
        })}
      </div>
      <div>
        {t("calculator:chart.tooltip.remainingDebt", {
          value: Math.round(y as number),
        })}
      </div>
    </Paper>
  );
}
