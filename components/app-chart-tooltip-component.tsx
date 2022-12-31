import Paper from "@mui/material/Paper";
import { DebtDatum } from "../store/selectors/graph-selector";
import { useMemo } from "react";

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
        {resolution}: {x as number}
      </div>
      <div>Deductible: {Math.round(sumPaidSoFar - sumInterestPaidSoFar)}</div>
      <div>Interest: {Math.round(sumInterestPaidSoFar)}</div>
      <div>Total Cost: {Math.round(sumPaidSoFar)}</div>
      <div>Remaining Debt: {Math.round(y as number)}</div>
    </Paper>
  );
}
