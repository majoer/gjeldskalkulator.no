import { ResponsiveLine, Serie } from "@nivo/line";
import { useTranslation } from "next-i18next";
import { THEME_PRIMARY, THEME_SECONDARY } from "../../pages/_app";
import { selectDebtSeries, selectTotalCostOfDebt } from "../../store/selectors/graph-selector";
import { useAppSelector } from "../../store/store";
import AppChartTooltipComponent from "./app-graph-tooltip-component";
import AppChartTooltipRestComponent from "./app-graph-tooltip-rest-component";

export default function AppChartComponent() {
  const { t } = useTranslation(["calculator"]);
  const { serie, resolution, restSerie } = useAppSelector(selectDebtSeries);
  const totalCost = useAppSelector(selectTotalCostOfDebt);
  const restId = t("calculator:chart.legend.rest");
  const debtId = t("calculator:chart.legend.debt");

  const data: Serie[] = [
    {
      id: restId,
      color: THEME_PRIMARY,
      data: restSerie,
    },
    {
      id: debtId,
      color: THEME_SECONDARY,
      data: serie,
    },
  ];

  return (
    <div className="h-5/6">
      <ResponsiveLine
        theme={{ legends: { text: { fontSize: "1rem" } } }}
        data={data}
        colors={(d) => d.color}
        margin={{ top: 20, right: 20, bottom: 80, left: 70 }}
        xScale={{
          type: "linear",
        }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
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
        tooltip={({ point }) =>
          point.serieId === debtId ? (
            <AppChartTooltipComponent
              datum={serie[point.data.x as number]}
              resolution={resolution}
              totalCost={totalCost}
            />
          ) : (
            <AppChartTooltipRestComponent
              datum={restSerie[point.data.x as number]}
              resolution={resolution}
            />
          )
        }
        useMesh={true}
        legends={[
          {
            anchor: "bottom-left",
            direction: "row",
            itemHeight: -100,
            itemWidth: 80,
          },
        ]}
      />
    </div>
  );
}
