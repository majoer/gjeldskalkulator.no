import { ResponsiveLine, Serie } from "@nivo/line";
import { maxMonths, selectDebtSeries } from "../store/selectors/graph-selector";
import { useAppSelector } from "../store/store";
import AppChartTooltipComponent from "./app-chart-tooltip-component";
import { useMemo } from "react";

const PLAN_TOO_LONG_TO_CALCULATE = -1;
const PLAN_BLOWS_TO_INFINITY = -2;

export default function AppChartComponent() {
  const { serie, resolution } = useAppSelector(selectDebtSeries);
  const lastDatum = serie[serie.length - 1];
  const totalCost = useMemo(() => {
    if (serie.length === 1) {
      return lastDatum.sumPaidSoFar;
    }

    if (12 * (serie.length - 1) === maxMonths) {
      return lastDatum.y > serie[serie.length - 2].y
        ? PLAN_BLOWS_TO_INFINITY
        : PLAN_TOO_LONG_TO_CALCULATE;
    }

    return Math.round(serie[serie.length - 1].sumPaidSoFar);
  }, [serie]);

  const data: Serie[] = [
    {
      id: "debt",
      color: "hsl(112, 70%, 50%)",
      data: serie,
    },
  ];

  return (
    <div className="h-full relative mr-3">
      <ResponsiveLine
        data={data}
        margin={{ top: 100, right: 20, bottom: 100, left: 80 }}
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
          legend: `${resolution}s`,
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Debt",
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
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
        Total cost of debt:{" "}
        {totalCost === -1
          ? `Too much. Its over ${Math.floor(
              maxMonths / 12
            )} years to complete.`
          : totalCost === -2
          ? "Infinity. This can't be paid back"
          : `${totalCost},-`}
      </div>
    </div>
  );
}
