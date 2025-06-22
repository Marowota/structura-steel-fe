"use client";
import { Button, Dropdown, Input, MainTable } from "@/components/elements";
import {
  EReportCardVariant,
  ReportCard,
} from "@/components/elements/reportCard";
import {
  CreditCard,
  DollarSign,
  HandCoins,
  ReceiptText,
  Truck,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import {
  downloadDailyReport,
  GetDailyReportsDTO,
  TDailyReport,
  useGetDailyReports,
} from "./api/getDailyReport";
import { newOrderColumns } from "./component/daily/newOrdersColumns";
import { completeDeliveryColumns } from "./component/daily/completeDeliveryColumns";
import { paymentTransactionColumns } from "./component/daily/paymentTransactionColumns";
import {
  downloadReceivableDebtReport,
  GetReceivableDebtReportsDTO,
  TReceivableDebtReport,
  useGetReceivableDebtReports,
} from "./api/getReceivableDebtReport";
import { receivableDebtColumns } from "./component/receivableDebtColumns";
import {
  downloadPayableDebtReport,
  GetPayableDebtReportsDTO,
  TPayableDebtReport,
  useGetPayableDebtReports,
} from "./api/getPayableDebtReport";
import {
  downloadProfitLossReport,
  GetProfitLossReportsDTO,
  TProfitLossReport,
  useGetProfitLossReports,
} from "./api/getProfitLossReport";
import { payableDebtColumns } from "./component/payableDebtColumns";
import { profitLossColumns } from "./component/profitLossColumns";
import dayjs from "dayjs";

enum EReportPageType {
  DAILY = "daily",
  RECEIVABLES = "receivables",
  PAYABLES = "payables",
  PROFIT_LOSS = "profit-loss",
}

type TReportPageData =
  | TDailyReport
  | TReceivableDebtReport[]
  | TPayableDebtReport[]
  | TProfitLossReport[];
type TReportPageDTO =
  | GetDailyReportsDTO
  | GetReceivableDebtReportsDTO
  | GetPayableDebtReportsDTO
  | GetProfitLossReportsDTO;

type EReportPageInfo = {
  dataHook: ({ params }: { params: TReportPageDTO }) => {
    data: TReportPageData | undefined;
  };
};

export default function ReportPage() {
  const orderPagesInfo = new Map<EReportPageType, EReportPageInfo>([
    [
      EReportPageType.DAILY,
      {
        dataHook: useGetDailyReports,
      },
    ],
    [
      EReportPageType.RECEIVABLES,
      {
        dataHook: useGetReceivableDebtReports,
      },
    ],
    [
      EReportPageType.PAYABLES,
      {
        dataHook: useGetPayableDebtReports,
      },
    ],
    [
      EReportPageType.PROFIT_LOSS,
      {
        dataHook: useGetProfitLossReports,
      },
    ],
  ]);
  const [reportPageType, setReportPageType] = useState<EReportPageType>(
    EReportPageType.DAILY,
  );
  const [periodParams, setPeriodParams] = useState<{
    startDate?: string;
    endDate?: string;
  }>({
    startDate: dayjs().startOf("D").toISOString(),
    endDate: dayjs().endOf("D").toISOString(),
  });
  const { dataHook } = orderPagesInfo.get(reportPageType)!;
  const { data } = dataHook({
    params: {
      download: false,
      start: periodParams.startDate,
      end: periodParams.endDate,
    },
  });

  const dailyData = data as TDailyReport;
  const renderTable = () => {
    switch (reportPageType) {
      case EReportPageType.DAILY:
        return (
          <>
            <div className="min-h-[78vh]">
              <MainTable
                heading={`New Orders: ${dailyData?.newOrders.length ?? 0}`}
                data={dailyData?.newOrders ?? []}
                columns={newOrderColumns}
              />
            </div>
            <div className="min-h-[78vh]">
              <MainTable
                heading={`Completed Deliveries: ${dailyData?.completedDeliveries.length ?? 0}`}
                data={dailyData?.completedDeliveries ?? []}
                columns={completeDeliveryColumns}
              />
            </div>
            <div className="min-h-[78vh]">
              <MainTable
                heading={`Payment Transactions: ${dailyData?.paymentTransactions.length ?? 0}`}
                data={dailyData?.paymentTransactions ?? []}
                columns={paymentTransactionColumns}
              />
            </div>
          </>
        );
      case EReportPageType.RECEIVABLES:
        const receivableData = data as TReceivableDebtReport[];
        return (
          <MainTable
            heading={`Receivable Debts: ${receivableData?.length ?? 0}`}
            data={receivableData ?? []}
            columns={receivableDebtColumns}
            containerClassName="h-[calc(80vh-4rem)]"
          />
        );
      case EReportPageType.PAYABLES:
        const payableData = data as TPayableDebtReport[];
        return (
          <MainTable
            heading={`Payable Debts: ${payableData?.length ?? 0}`}
            data={payableData ?? []}
            columns={payableDebtColumns}
            containerClassName="h-[calc(80vh-4rem)]"
          />
        );
      case EReportPageType.PROFIT_LOSS:
        const profitLossData = data as TProfitLossReport[];
        return (
          <MainTable
            heading={`Profit & Loss: ${profitLossData?.length ?? 0}`}
            data={profitLossData ?? []}
            columns={profitLossColumns}
            containerClassName="h-[calc(80vh-4rem)]"
          />
        );
      default:
        return <div>No data available</div>;
    }
  };

  const downloadReport = async () => {
    let response;
    switch (reportPageType) {
      case EReportPageType.DAILY:
        response = await downloadDailyReport();
        break;
      case EReportPageType.RECEIVABLES:
        response = await downloadReceivableDebtReport({
          start: periodParams.startDate,
          end: periodParams.endDate,
        });
        break;
      case EReportPageType.PAYABLES:
        response = await downloadPayableDebtReport({
          start: periodParams.startDate,
          end: periodParams.endDate,
        });
        break;
      case EReportPageType.PROFIT_LOSS:
        response = await downloadProfitLossReport({
          start: periodParams.startDate,
          end: periodParams.endDate,
        });
    }
    if (response) {
      const disposition = response.headers["content-disposition"];
      let filename = "download";

      if (disposition) {
        const match = disposition.match(/filename="?(.+?)"?($|;)/);
        if (match) {
          filename = match[1];
        }
      }

      filename = filename + ".xlsx";

      const url = URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col gap-3 pt-3">
        <div className="flex items-center gap-2">
          <div className="w-64">
            <Dropdown
              options={[
                {
                  label: "Daily",
                  selectionLabel: "Daily",
                  value: EReportPageType.DAILY,
                },
                {
                  label: "Receivable",
                  selectionLabel: "Receivable",
                  value: EReportPageType.RECEIVABLES,
                },
                {
                  label: "Payable",
                  selectionLabel: "Payable",
                  value: EReportPageType.PAYABLES,
                },
                {
                  label: "Profit & Loss",
                  selectionLabel: "Profit & Loss",
                  value: EReportPageType.PROFIT_LOSS,
                },
              ]}
              outerValue={reportPageType}
              onItemSelect={(item) => {
                setReportPageType(item.value as EReportPageType);
              }}
            />
          </div>
          {reportPageType !== EReportPageType.DAILY && (
            <>
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
            </>
          )}
          <div className="ml-auto">
            <Button size="md" onClick={downloadReport}>
              Export excel
            </Button>
          </div>
        </div>
        <div className="border-brand-300 flex h-[75vh] flex-col gap-2 overflow-auto border-l-2 px-2 py-2">
          {reportPageType === EReportPageType.DAILY && (
            <>
              <div className="flex gap-2">
                <ReportCard
                  variant={EReportCardVariant.SUCCESS}
                  title="Received"
                  description={
                    (dailyData?.summary.totalAmountReceived.toLocaleString(
                      "vi-VN",
                    ) ?? "0") + " VND"
                  }
                  icon={<HandCoins className="h-5 w-5" />}
                  className="flex-1"
                />
                <ReportCard
                  variant={EReportCardVariant.ERROR}
                  title="Paid"
                  description={
                    (dailyData?.summary.totalAmountPaid.toLocaleString(
                      "vi-VN",
                    ) ?? "0") + " VND"
                  }
                  icon={<WalletCards className="h-5 w-5" />}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2">
                <ReportCard
                  variant={EReportCardVariant.PRIMARY}
                  title="Sale orders"
                  description={
                    dailyData?.summary.newSaleOrdersCount.toLocaleString(
                      "vi-VN",
                    ) ?? "0"
                  }
                  icon={<ReceiptText className="h-5 w-5" />}
                  className="flex-1"
                />
                <ReportCard
                  variant={EReportCardVariant.PRIMARY}
                  title="Import orders"
                  description={
                    dailyData?.summary.newPurchaseOrdersCount.toLocaleString(
                      "vi-VN",
                    ) ?? "0"
                  }
                  icon={<CreditCard className="h-5 w-5" />}
                  className="flex-1"
                />
                <ReportCard
                  variant={EReportCardVariant.PRIMARY}
                  title="Completed delivery"
                  description={
                    dailyData?.summary.completedDeliveriesCount.toLocaleString(
                      "vi-VN",
                    ) ?? "0"
                  }
                  icon={<Truck className="h-5 w-5" />}
                  className="flex-1"
                />
                <ReportCard
                  variant={EReportCardVariant.PRIMARY}
                  title="Total receivables"
                  description={
                    (dailyData?.summary.newSaleOrdersValue.toLocaleString(
                      "vi-VN",
                    ) ?? "0") + " VND"
                  }
                  icon={<DollarSign className="h-5 w-5" />}
                  className="flex-1"
                />
              </div>
            </>
          )}
          {renderTable()}
        </div>
      </div>
    </>
  );
}
