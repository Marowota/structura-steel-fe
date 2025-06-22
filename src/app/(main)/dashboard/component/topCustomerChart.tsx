"use client";
import { Input } from "@/components/elements";
import dayjs from "dayjs";
import { useState } from "react";
import { useGetTopCustomer } from "../api/getTopCustomer";
import { BarChart } from "./charts";
import { limitTickLength } from "../helper/limitTickLength";
import { colors } from "../constant/color";

export const TopCustomerChart = () => {
  const [periodParams, setPeriodParams] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: dayjs().startOf("D").add(-30, "day").toISOString(),
    endDate: dayjs().endOf("D").toISOString(),
  });
  const { data: topCustomerData } = useGetTopCustomer({
    params: {
      start: periodParams.startDate,
      end: periodParams.endDate,
    },
  });

  return (
    <>
      <div className="border-brand-300 flex h-fit w-full flex-col gap-3 rounded-md border px-3 py-2">
        <div className="flex items-center">
          <div className="text-lg-bold text-info-800">Top Customer</div>
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
          <BarChart
            data={{
              labels:
                topCustomerData?.map((item) => {
                  return limitTickLength(item.name, 20);
                }) || [],
              datasets: [
                {
                  label: "Purchase Value",
                  data: topCustomerData?.map((item) => item.value) || [],
                  backgroundColor: colors.brand["400"],
                  borderColor: colors.brand["800"],
                  borderWidth: 1,
                  maxBarThickness: 50,
                },
              ],
            }}
            option={{
              indexAxis: "y",
            }}
          />
        </div>
      </div>
    </>
  );
};
