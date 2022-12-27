import { ResponsiveLine } from "@nivo/line";

export default function AppChartComponent() {
  const data = [
    {
      id: "japan",
      color: "hsl(112, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 173,
        },
        {
          x: "helicopter",
          y: 197,
        },
        {
          x: "boat",
          y: 147,
        },
        {
          x: "train",
          y: 179,
        },
        {
          x: "subway",
          y: 85,
        },
        {
          x: "bus",
          y: 63,
        },
        {
          x: "car",
          y: 74,
        },
        {
          x: "moto",
          y: 295,
        },
        {
          x: "bicycle",
          y: 279,
        },
        {
          x: "horse",
          y: 111,
        },
        {
          x: "skateboard",
          y: 74,
        },
        {
          x: "others",
          y: 171,
        },
      ],
    },
    {
      id: "france",
      color: "hsl(220, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 15,
        },
        {
          x: "helicopter",
          y: 291,
        },
        {
          x: "boat",
          y: 59,
        },
        {
          x: "train",
          y: 150,
        },
        {
          x: "subway",
          y: 216,
        },
        {
          x: "bus",
          y: 174,
        },
        {
          x: "car",
          y: 298,
        },
        {
          x: "moto",
          y: 161,
        },
        {
          x: "bicycle",
          y: 33,
        },
        {
          x: "horse",
          y: 204,
        },
        {
          x: "skateboard",
          y: 263,
        },
        {
          x: "others",
          y: 177,
        },
      ],
    },
    {
      id: "us",
      color: "hsl(280, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 177,
        },
        {
          x: "helicopter",
          y: 250,
        },
        {
          x: "boat",
          y: 165,
        },
        {
          x: "train",
          y: 296,
        },
        {
          x: "subway",
          y: 184,
        },
        {
          x: "bus",
          y: 214,
        },
        {
          x: "car",
          y: 263,
        },
        {
          x: "moto",
          y: 192,
        },
        {
          x: "bicycle",
          y: 115,
        },
        {
          x: "horse",
          y: 18,
        },
        {
          x: "skateboard",
          y: 254,
        },
        {
          x: "others",
          y: 135,
        },
      ],
    },
    {
      id: "germany",
      color: "hsl(298, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 26,
        },
        {
          x: "helicopter",
          y: 149,
        },
        {
          x: "boat",
          y: 227,
        },
        {
          x: "train",
          y: 242,
        },
        {
          x: "subway",
          y: 289,
        },
        {
          x: "bus",
          y: 204,
        },
        {
          x: "car",
          y: 11,
        },
        {
          x: "moto",
          y: 107,
        },
        {
          x: "bicycle",
          y: 255,
        },
        {
          x: "horse",
          y: 49,
        },
        {
          x: "skateboard",
          y: 95,
        },
        {
          x: "others",
          y: 123,
        },
      ],
    },
    {
      id: "norway",
      color: "hsl(132, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 175,
        },
        {
          x: "helicopter",
          y: 121,
        },
        {
          x: "boat",
          y: 16,
        },
        {
          x: "train",
          y: 195,
        },
        {
          x: "subway",
          y: 51,
        },
        {
          x: "bus",
          y: 83,
        },
        {
          x: "car",
          y: 212,
        },
        {
          x: "moto",
          y: 87,
        },
        {
          x: "bicycle",
          y: 15,
        },
        {
          x: "horse",
          y: 3,
        },
        {
          x: "skateboard",
          y: 209,
        },
        {
          x: "others",
          y: 117,
        },
      ],
    },
  ];

  return (
    <div className="h-full">
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
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
          legend: "transportation",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "count",
          legendOffset: -40,
          legendPosition: "middle",
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
