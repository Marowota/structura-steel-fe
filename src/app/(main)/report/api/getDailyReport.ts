import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import { IPagination } from "@/types/IPagination";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

export enum EOrderType {
  PURCHASE = "PURCHASE",
  SALE = "SALE",
  DELIVERY = "DELIVERY",
}

export type TDailyReportSummary = {
  newSaleOrdersCount: number;
  newSaleOrdersValue: number;
  newPurchaseOrdersCount: number;
  completedDeliveriesCount: number;
  totalAmountReceived: number;
  totalAmountPaid: number;
};

export type TNewOrderItem = {
  createdAt: string;
  orderType: EOrderType;
  orderCode: string;
  partnerName: string;
  value: number;
  createdBy: string;
};

export type TCompletedDeliveryItem = {
  deliveryCode: string;
  originalOrderCode: string;
  customerName: string;
  deliveryAddress: string;
  completionTime: string;
};

export enum TReportTransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export const ReportTransactionLabels = new Map<TReportTransactionType, string>([
  [TReportTransactionType.INCOME, "Income"],
  [TReportTransactionType.EXPENSE, "Expense"],
]);

export type TPaymentTransactionItem = {
  paymentTime: string;
  transactionType: TReportTransactionType;
  partnerName: string;
  amount: number;
  paymentMethod: string;
  notes: string;
};

export type TDailyReport = {
  summary: TDailyReportSummary;
  newOrders: TNewOrderItem[];
  completedDeliveries: TCompletedDeliveryItem[];
  paymentTransactions: TPaymentTransactionItem[];
};

export type GetDailyReportsDTO = IPagination & {
  download?: boolean;
};

export type TUseGetDailyReportsParams = {
  params?: GetDailyReportsDTO;
  options?: UseQueryOptions<TResult>;
};

type TResult = TDailyReport;

const getDailyReport = async (params?: GetDailyReportsDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.reportService.daily,
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const downloadDailyReport = async () => {
  try {
    const response = await extendedAxios.get<Blob>(
      API_URL.reportService.daily,
      {
        params: { download: true },
        responseType: "blob",
      },
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetDailyReports = ({
  options,
  params,
}: TUseGetDailyReportsParams = {}) => {
  const query = useQuery({
    queryKey: ["dailyReports", params],
    queryFn: () => getDailyReport(params),
    ...options,
  });

  return { ...query };
};
