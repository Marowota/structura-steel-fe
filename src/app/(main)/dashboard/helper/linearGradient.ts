import { ChartTypeRegistry, ScriptableContext } from "chart.js";

export const getLinearGradient = ({
  context,
  from = "",
  to = "",
}: {
  context?: ScriptableContext<keyof ChartTypeRegistry>;
  from?: string;
  to?: string;
}) => {
  if (!context || !context.chart) return;
  const chart = context.chart;
  const { ctx, chartArea } = chart;
  if (!ctx || !chartArea) return;

  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  let width, height, gradient;

  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, from);
    gradient.addColorStop(0.5, to);
    gradient.addColorStop(1, to);
  }

  return gradient;
};
