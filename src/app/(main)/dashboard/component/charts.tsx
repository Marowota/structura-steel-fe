"use client";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  CategoryScale,
  Chart,
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions,
} from "chart.js";

Chart.register(
  CategoryScale,
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
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
          line: {
            tension: 0.35,
          },
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
