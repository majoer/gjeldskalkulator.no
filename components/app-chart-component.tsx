import Typography from "@mui/material/Typography";
import { ResponsiveLine, Serie } from "@nivo/line";
import { useTranslation } from "next-i18next";
import {
  MAX_MONTHS,
  selectDebtSeries,
  selectTotalCostOfDebt,
} from "../store/selectors/graph-selector";
import { useAppSelector } from "../store/store";
import AppChartTooltipComponent from "./app-chart-tooltip-component";

export default function AppChartComponent() {
  const { t } = useTranslation(["calculator"]);
  const { serie, resolution } = useAppSelector(selectDebtSeries);
  const totalCost = useAppSelector(selectTotalCostOfDebt);

  const data: Serie[] = [
    {
      id: "debt",
      color: "hsl(112, 70%, 50%)",
      data: serie,
    },
  ];

  return (
    <div className="h-5/6">
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
        xScale={{
          type: "linear",
        }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: t(`calculator:chart.legend.x.${resolution}`),
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: t("calculator:chart.legend.y"),
          legendOffset: -55,
          legendPosition: "start",
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        tooltip={({ point }) => (
          <AppChartTooltipComponent
            datum={serie[point.data.x as number]}
            resolution={resolution}
            totalCost={totalCost}
          />
        )}
        useMesh={true}
        legends={[]}
      />
      <Typography>
        {totalCost === -1
          ? t("calculator:chart.totalCost.tooMuch", {
              value: Math.floor(MAX_MONTHS / 12),
            })
          : totalCost === -2
          ? t("calculator:chart.totalCost.infinity")
          : t("calculator:chart.totalCost.result", {
              value: totalCost,
            })}
      </Typography>
    </div>
  );
}
