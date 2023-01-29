import Paper from "@mui/material/Paper";
import { Datum } from "@nivo/line";
import { useTranslation } from "next-i18next";

export interface AppChartTooltipRestComponentProps {
  datum: Datum;
  resolution: "Year" | "Month";
}

export default function AppChartTooltipRestComponent({
  datum: { x, y },
  resolution,
}: AppChartTooltipRestComponentProps) {
  const { t } = useTranslation(["calculator"]);

  return (
    <Paper className={`p-2 border-2 border-solid border-blue-200`}>
      <div>
        {t(`calculator:chart.tooltip.resolution.${resolution}`, {
          value: x as number,
        })}
      </div>
      <div>
        {t("calculator:chart.tooltip.rest", {
          value: y,
        })}
      </div>
    </Paper>
  );
}
