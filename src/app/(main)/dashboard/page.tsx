"use client";
import { DebtStatuesAmountChart } from "./component/debtStatuesAmountChart";
import { DebtStatuesCountChart } from "./component/debtStatuesCountChart";
import { RevenueOvertimeChart } from "./component/revenueOvertimeChart";
import { SummaryChart } from "./component/sumaryChart";
import { TopCustomerChart } from "./component/topCustomerChart";
import { TopProductChart } from "./component/topProductChart";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col gap-3 py-3">
      <SummaryChart />
      <RevenueOvertimeChart />
      <TopCustomerChart />
      <TopProductChart />
      <div className="grid grid-cols-2 gap-3">
        <DebtStatuesAmountChart />
        <DebtStatuesCountChart />
      </div>
      <div className="min-h-3"></div>
    </div>
  );
}
