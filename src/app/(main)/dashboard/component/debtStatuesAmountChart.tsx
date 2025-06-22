"use client";
import { Dropdown } from "@/components/elements";
import { useState } from "react";
import { useGetDebtStatues } from "../api/getDebtStatues";
import { DoughnutChart } from "./charts";
import { limitTickLength } from "../helper/limitTickLength";
import { colors } from "../constant/color";
import { EDebtType, EDebtTypeLabel } from "../../debt/api/postPayDebt";

export const DebtStatuesAmountChart = () => {
  const [debtType, setDebtType] = useState<EDebtType>(EDebtType.ORDER);
  const { data: debtStatuesData } = useGetDebtStatues({
    params: {
      type: debtType,
    },
  });

  return (
    <>
      <div className="border-brand-300 flex h-fit w-full flex-col gap-3 rounded-md border px-3 py-2">
        <div className="flex items-center">
          <div className="text-lg-bold text-info-800">Debt statues amount</div>
          <div className="ml-auto flex items-center gap-2">
            <div>Type </div>
            <Dropdown
              options={Object.entries(EDebtType).map(([, value]) => {
                return {
                  label: EDebtTypeLabel[value],
                  selectionLabel: EDebtTypeLabel[value],
                  value: value,
                };
              })}
              onItemSelect={(item) => {
                setDebtType(item.value as EDebtType);
              }}
              outerValue={debtType}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex h-[80vh] w-full items-center">
            <DoughnutChart
              data={{
                labels:
                  debtStatuesData?.map((item) => {
                    return limitTickLength(item.status, 20);
                  }) || [],
                datasets: [
                  {
                    label: "Total amount",
                    data:
                      debtStatuesData?.map((item) => item.totalAmount) || [],
                    backgroundColor: [
                      colors.info["400"],
                      colors.brand["400"],
                      colors.neutral["400"],
                    ],
                    borderRadius: 5,
                  },
                ],
              }}
              option={{
                indexAxis: "y",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
