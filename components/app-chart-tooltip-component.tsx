import Paper from "@mui/material/Paper";
import { DebtDatum } from "../store/selectors/graph-selector";

export interface AppChartTooltipComponentProps {
  datum: DebtDatum;
  resolution: "Year" | "Month";
}

export default function AppChartTooltipComponent({
  datum: { x, y, interestPaidSoFar, sumPaidSoFar },
  resolution,
}: AppChartTooltipComponentProps) {
  return (
    <Paper className="p-2 border-red-200 border-2 border-solid">
      <div>
        {resolution}: {x as number}
      </div>
      <div>Debt: {Math.round(y as number)}</div>
      <div>Cost: {sumPaidSoFar}</div>
    </Paper>
  );
}
