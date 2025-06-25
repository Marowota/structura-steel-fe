"use client";
import dynamic from "next/dynamic";
import { ChartData, ChartOptions } from "chart.js";
import "chart.js/auto";

export const Line = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Line),
  {
    ssr: false,
  },
);
export const Bar = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bar),
  {
    ssr: false,
  },
);
export const Doughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false },
);

export const LineChart = ({ data }: { data: ChartData<"line"> }) => {
  return (
    <Line
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#101828",
              font: { size: 14, lineHeight: "20px", weight: 400 },
              boxWidth: 60,
              boxHeight: 12,
              padding: 24,
            },
            display: false,
          },
          title: {
            display: false,
            text: "Revenue Overtime Chart",
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#101828",
              font: {
                size: 12,
                lineHeight: "18px",
                weight: 400,
              },
            },
          },
          y: {
            stacked: true,
            ticks: {
              color: "#101828",
              font: {
                size: 12,
                lineHeight: "18px",
                weight: 400,
              },
            },
          },
        },
        elements: {
          point: {
            radius: 4,
            hoverBackgroundColor: "#fff",
            hoverRadius: 6,
            hoverBorderWidth: 4,
            borderWidth: 3,
          },
        },
        aspectRatio: 2.2,
      }}
      data={data}
    />
  );
};

export const BarChart = ({
  data,
  option,
}: {
  data: ChartData<"bar">;
  option?: ChartOptions<"bar">;
}) => {
  return (
    <Bar
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true,
          },
          legend: {
            labels: {
              color: "#101828",
              font: { size: 14, lineHeight: "20px", weight: 400 },
              boxWidth: 60,
              boxHeight: 12,
              padding: 24,
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: "#101828",
              font: {
                size: 12,
                lineHeight: "18px",
                weight: 400,
              },
              maxRotation: 0,
              autoSkip: false,
            },
          },
          y: {
            stacked: true,
            ticks: {
              color: "#101828",
              font: {
                size: 12,
                lineHeight: "18px",
                weight: 400,
              },
            },
          },
        },
        aspectRatio: 2.2,
        ...option,
      }}
      data={data}
    />
  );
};

export const DoughnutChart = ({
  data,
  option,
}: {
  data: ChartData<"doughnut">;
  option?: ChartOptions<"doughnut">;
}) => {
  return (
    <Doughnut
      data={data}
      options={{
        ...option,
        responsive: true,
        maintainAspectRatio: false,
        cutout: "40%",
        plugins: {
          legend: {
            position: "right",
            labels: {
              usePointStyle: true,
              boxWidth: 20,
              padding: 16,
              font: {
                size: 14,
                lineHeight: "20px",
                weight: 400,
              },
            },
            rtl: true,
          },
          tooltip: {
            enabled: true,
          },
          ...option?.plugins,
        },
      }}
    />
  );
};
