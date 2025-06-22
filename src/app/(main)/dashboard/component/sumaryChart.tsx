"use client";
import { EReportCardVariant, Input, ReportCard } from "@/components/elements";
import dayjs from "dayjs";
import { useState } from "react";
import { useGetSummary } from "../api/getSummary";
import { ArrowDown, ArrowUp, Coins, HandCoins, TrendingUp } from "lucide-react";

export const SummaryChart = () => {
  const [periodParams, setPeriodParams] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: dayjs().startOf("D").add(-30, "day").toISOString(),
    endDate: dayjs().endOf("D").toISOString(),
  });
  const { data: summaryData } = useGetSummary({
    params: {
      start: periodParams.startDate,
      end: periodParams.endDate,
    },
  });
  return (
    <>
      <div className="flex gap-2">
        <ReportCard
          variant={EReportCardVariant.SUCCESS_SECONDARY}
          title="Total sale debt overtime"
          description={
            (summaryData?.totalDebtReceivable?.toLocaleString("vi-VN") ?? "0") +
            " VND"
          }
          icon={<ArrowUp className="h-5 w-5" />}
          className="flex-1"
        />
        <ReportCard
          variant={EReportCardVariant.ERROR_SECONDARY}
          title="Total import debt overtime"
          description={
            (summaryData?.totalDebtPayable?.toLocaleString("vi-VN") ?? "0") +
            " VND"
          }
          icon={<ArrowDown className="h-5 w-5" />}
          className="flex-1"
        />
      </div>
      <div className="border-brand-300 flex h-fit w-full flex-col gap-3 rounded-md border px-3 py-2">
        <div className="flex items-center">
          <div className="text-lg-bold text-info-800">Summary</div>
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
        <div className="flex gap-2">
          <ReportCard
            variant={EReportCardVariant.PRIMARY}
            title="Revenue"
            description={
              (summaryData?.totalRevenue?.toLocaleString("vi-VN") ?? "0") +
              " VND"
            }
            icon={<HandCoins className="h-5 w-5" />}
            className="flex-1"
          />
          <ReportCard
            variant={EReportCardVariant.PRIMARY}
            title="Cost"
            description={
              (summaryData?.totalCostOfGoods?.toLocaleString("vi-VN") ?? "0") +
              " VND"
            }
            icon={<Coins className="h-5 w-5" />}
            className="flex-1"
          />
          <ReportCard
            variant={EReportCardVariant.PRIMARY}
            title="Profit"
            description={
              (summaryData?.grossProfit?.toLocaleString("vi-VN") ?? "0") +
              " VND"
            }
            icon={<TrendingUp className="h-5 w-5" />}
            className="flex-1"
          />
        </div>
      </div>
    </>
  );
};
