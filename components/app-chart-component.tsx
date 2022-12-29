import { ResponsiveLine, Serie } from "@nivo/line";
import { useAppSelector } from "../store/store";
import { selectDebtSerie } from "../store/selectors/graph-selector";

export default function AppChartComponent() {
  const debtSerie = useAppSelector(selectDebtSerie);
  const data: Serie[] = [
    {
      id: "debt",
      color: "hsl(112, 70%, 50%)",
      data: debtSerie,
    },
  ];

  return (
    <div className="h-full">
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 20, bottom: 50, left: 80 }}
        xScale={{ type: "point" }}
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
          legend: "Months",
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
        useMesh={true}
        legends={[]}
      />
    </div>
  );
}
