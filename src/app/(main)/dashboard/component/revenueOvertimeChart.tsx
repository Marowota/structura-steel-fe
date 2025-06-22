"use client";
import { Input } from "@/components/elements";
import dayjs from "dayjs";
import { useState } from "react";
import { useGetRevenueOvertime } from "../api/getRevenueOvertime";
import { LineChart } from "./charts";
import { colors, colorToAlpha } from "../constant/color";
import { getLinearGradient } from "../helper/linearGradient";
import { ChartTypeRegistry, ScriptableContext } from "chart.js";

export const RevenueOvertimeChart = () => {
  const [periodParams, setPeriodParams] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: dayjs().startOf("D").add(-30, "day").toISOString(),
    endDate: dayjs().endOf("D").toISOString(),
  });
  const { data: revenueOvertimeData } = useGetRevenueOvertime({
    params: {
      start: periodParams.startDate,
      end: periodParams.endDate,
    },
  });

  return (
    <>
      <div className="border-brand-300 flex h-fit w-full flex-col gap-3 rounded-md border px-3 py-2">
        <div className="flex items-center">
          <div className="text-lg-bold text-info-800">Revenue Overtime</div>
          <div className="ml-auto flex items-center gap-2">
            <div>Period: </div>
            <Input
              className="w-64"
              type="date"
              value={periodParams.startDate?.split("T")[0]}
              onChange={(e) =>
                setPeriodParams({
                  ...periodParams,
                  startDate: dayjs(e.target.value).startOf("D").toISOString(),
                })
              }
              max={periodParams.endDate?.split("T")[0]}
            />
            -
            <Input
              className="w-64"
              type="date"
              value={periodParams.endDate?.split("T")[0]}
              onChange={(e) =>
                setPeriodParams({
                  ...periodParams,
                  endDate: dayjs(e.target.value).endOf("D").toISOString(),
                })
              }
              min={periodParams.startDate?.split("T")[0]}
            />
          </div>
        </div>
        <div className="flex h-[80vh] w-full items-center">
          <LineChart
            data={{
              yLabels: ["VND"],
              labels: revenueOvertimeData?.map((item) => item.label) ?? [],
              datasets: [
                {
                  label: "Revenue",
                  data: revenueOvertimeData?.map((item) => item.value) ?? [],
                  borderColor: colors.info[500],
                  backgroundColor: (
                    context: ScriptableContext<keyof ChartTypeRegistry>,
                  ) => {
                    return getLinearGradient({
                      context,
                      from: colors.transparent_white,
                      to: colorToAlpha(colors.info[300], 0.2),
                    });
                  },
                  pointBackgroundColor: "#fff",
                  fill: "start",
                },
              ],
            }}
          />
        </div>
      </div>
    </>
  );
};
