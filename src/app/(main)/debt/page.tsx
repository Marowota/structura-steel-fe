"use client";
import {
  Dropdown,
  EBaseActions,
  Input,
  InputSearch,
  mapArrayToTDropdown,
  TTableActionsProps,
} from "@/components/elements";
import { ColumnDef, Row } from "@tanstack/react-table";
import { HandCoins } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { TableFilter } from "@/components/elements/tableFilter";
import { useDebouncedCallback } from "use-debounce";
import {
  GetOrderDebtsDTO,
  TOrderDebt,
  useGetOrderDebts,
} from "./api/orderDebt/getOrderDebt";
import {
  GetImportDebtsDTO,
  TImportDebt,
  useGetImportDebts,
} from "./api/importDebt/getImportDebt";
import {
  GetDeliveryDebtsDTO,
  TDeliveryDebt,
  useGetDeliveryDebts,
} from "./api/deliveryDebt/getDeliveryDebt";
import { orderDebtColumns } from "./component/table/orderDebtTable";
import { importDebtColumns } from "./component/table/importDebtTable";
import { deliveryDebtColumns } from "./component/table/deliveryDebtTable";
import {
  DEFAULT_PAGINATION_PARAMS,
  DEFAULT_PAGINATION_RESPONSE,
  IPaginationResponse,
} from "@/types/IPagination";
import {
  GetOrdersDTO,
  TOrder,
  useGetInfiniteOrders,
} from "../order/api/getOrders";
import {
  GetImportsDTO,
  TImport,
  useGetInfiniteImports,
} from "../import/api/getImports";
import {
  GetDeliveriesDTO,
  TDelivery,
  useGetInfiniteDeliveries,
} from "../delivery/api/getDeliveries";
import { PayDebtModal } from "./component/modal/payDebtModal";
import { EDebtType } from "./api/postPayDebt";

type TDebt = TOrderDebt | TImportDebt | TDeliveryDebt;
type TDebtDTO = GetOrderDebtsDTO | GetImportDebtsDTO | GetDeliveryDebtsDTO;

type TAllOrder = TOrder | TImport | TDelivery;

type TDebtPage = {
  type: EDebtType;
  columns: ColumnDef<TDebt>[];
  paramsKey: string;
  dataHook: ({ params }: { params: TDebtDTO }) => {
    data: IPaginationResponse<TDebt> | undefined;
  };
  defaultParams?: TDebtDTO;
  currentOrderData?: IPaginationResponse<TAllOrder & { code?: string }>;
};

const debtPage = new Map<EDebtType, TDebtPage>([
  [
    EDebtType.ORDER,
    {
      type: EDebtType.ORDER,
      columns: orderDebtColumns as ColumnDef<TDebt>[],
      paramsKey: "od",
      dataHook: useGetOrderDebts,
    },
  ],
  [
    EDebtType.IMPORT,
    {
      type: EDebtType.IMPORT,
      columns: importDebtColumns as ColumnDef<TDebt>[],
      paramsKey: "ip",
      dataHook: useGetImportDebts,
    },
  ],
  [
    EDebtType.DELIVERY,
    {
      type: EDebtType.DELIVERY,
      columns: deliveryDebtColumns as ColumnDef<TDebt>[],
      paramsKey: "dl",
      dataHook: useGetDeliveryDebts,
    },
  ],
]);

export default function DebtPage() {
  const [debtType, setDebtType] = useState<EDebtType>(EDebtType.ORDER);
  const [orderDebtPageId, setOrderDebtPageId] = useState<string>("");
  const actions = debtPage.get(debtType);

  const [orderInfiniteParams, setOrderInfiniteParams] = useState<GetOrdersDTO>(
    DEFAULT_PAGINATION_PARAMS as GetOrdersDTO,
  );
  const [importInfiniteParams, setImportInfiniteParams] =
    useState<GetImportsDTO>(DEFAULT_PAGINATION_PARAMS as GetImportsDTO);
  const [deliveryInfiniteParams, setDeliveryInfiniteParams] =
    useState<GetDeliveriesDTO>(DEFAULT_PAGINATION_PARAMS as GetDeliveriesDTO);

  const {
    data: orderInfiniteData,
    fetchNextPage: fetchNextPageOrder,
    isLoading: isLoadingOrder,
  } = useGetInfiniteOrders({ params: orderInfiniteParams });
  const {
    data: importInfiniteData,
    fetchNextPage: fetchNextPageImport,
    isLoading: isLoadingImport,
  } = useGetInfiniteImports({ params: importInfiniteParams });
  const {
    data: deliveryInfiniteData,
    fetchNextPage: fetchNextPageDelivery,
    isLoading: isLoadingDelivery,
  } = useGetInfiniteDeliveries({ params: deliveryInfiniteParams });

  const orderData = useMemo(() => {
    const lastPage =
      orderInfiniteData?.pages?.[orderInfiniteData.pages.length - 1] ??
      DEFAULT_PAGINATION_RESPONSE;
    return {
      ...lastPage,
      content: orderInfiniteData?.pages
        ? orderInfiniteData.pages.map((page) => page.content).flat()
        : [],
    };
  }, [orderInfiniteData]);

  const importData = useMemo(() => {
    const lastPage =
      importInfiniteData?.pages?.[importInfiniteData.pages.length - 1] ??
      DEFAULT_PAGINATION_RESPONSE;
    return {
      ...lastPage,
      content: importInfiniteData?.pages
        ? importInfiniteData.pages.map((page) => page.content).flat()
        : [],
    };
  }, [importInfiniteData]);

  const deliveryData = useMemo(() => {
    const lastPage =
      deliveryInfiniteData?.pages?.[deliveryInfiniteData.pages.length - 1] ??
      DEFAULT_PAGINATION_RESPONSE;
    return {
      ...lastPage,
      content: deliveryInfiniteData?.pages
        ? deliveryInfiniteData.pages.map((page) => page.content).flat()
        : [],
    };
  }, [deliveryInfiniteData]);

  const isLoadingOrderData =
    isLoadingOrder || isLoadingImport || isLoadingDelivery;

  switch (actions?.type) {
    case EDebtType.ORDER:
      actions.currentOrderData = {
        ...orderData,
        content: orderData.content.map((order) => ({
          ...order,
          code: order.exportCode,
        })),
      };
      break;
    case EDebtType.IMPORT:
      actions.currentOrderData = {
        ...importData,
        content: importData.content.map((importOrder) => ({
          ...importOrder,
          code: importOrder.importCode,
        })),
      };
      break;
    case EDebtType.DELIVERY:
      actions.currentOrderData = {
        ...deliveryData,
        content: deliveryData.content.map((delivery) => ({
          ...delivery,
          code: delivery.deliveryCode,
        })),
      };
      break;
  }

  const [isOpenPayDebt, setIsOpenPayDebt] = useState({
    isOpen: false,
    editId: undefined,
    type: EDebtType.ORDER,
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  const onRowClick = (row: Row<TDebt>) => {
    console.log(row.getValue("id"));
  };

  const onPayDebt = (row: Row<TDebt>) => {
    setIsOpenPayDebt({
      isOpen: true,
      editId: row.getValue("id"),
      type: actions?.type ?? EDebtType.ORDER,
    });
  };

  const tableActions: TTableActionsProps<TDebt>[] = [
    {
      action: EBaseActions.EDIT,
      icon: <HandCoins className="h-4 w-4" />,
      onClick: onPayDebt,
    },
  ];

  return (
    <>
      <PayDebtModal
        isOpen={isOpenPayDebt.isOpen}
        onClose={() =>
          setIsOpenPayDebt({
            isOpen: false,
            editId: undefined,
            type: EDebtType.ORDER,
          })
        }
        editId={isOpenPayDebt.editId}
        debtType={isOpenPayDebt.type}
      />
      <div className="flex h-full flex-col gap-3 pt-3">
        <div className="flex justify-start gap-2">
          <Input
            placeholder="Search debt"
            className="min-w-64"
            onChange={(e) => {
              debouncedSearch(e.currentTarget.value);
            }}
          />
          <div className="w-64">
            <Dropdown
              placeholder="Select debt type"
              options={[
                {
                  label: "Order Debt",
                  selectionLabel: "Order Debt",
                  value: EDebtType.ORDER,
                },
                {
                  label: "Import Debt",
                  selectionLabel: "Import Debt",
                  value: EDebtType.IMPORT,
                },
                {
                  label: "Delivery Debt",
                  selectionLabel: "Delivery Debt",
                  value: EDebtType.DELIVERY,
                },
              ]}
              outerValue={debtType}
              onItemSelect={(item) => {
                setDebtType(item.value as EDebtType);
                setOrderDebtPageId("");
              }}
            />
          </div>
          <div>
            <InputSearch
              placeholder="Select order..."
              key={actions?.paramsKey}
              options={mapArrayToTDropdown(
                actions?.currentOrderData?.content ?? [],
                "code",
                "id",
              )}
              onItemSelect={(item) => {
                setOrderDebtPageId(item.value);
                setSearch("");
              }}
              isLoading={isLoadingOrderData}
              onPageChange={() => {
                switch (debtType) {
                  case EDebtType.ORDER:
                    fetchNextPageOrder();
                    break;
                  case EDebtType.IMPORT:
                    fetchNextPageImport();
                    break;
                  case EDebtType.DELIVERY:
                    fetchNextPageDelivery();
                    break;
                }
              }}
              paginationInfo={actions?.currentOrderData}
              onSearch={(label) => {
                switch (debtType) {
                  case EDebtType.ORDER:
                    setOrderInfiniteParams((prev) => ({
                      ...prev,
                      search: label,
                      pageNo: 0,
                    }));
                    break;
                  case EDebtType.IMPORT:
                    setImportInfiniteParams((prev) => ({
                      ...prev,
                      search: label,
                      pageNo: 0,
                    }));
                    break;
                  case EDebtType.DELIVERY:
                    setDeliveryInfiniteParams((prev) => ({
                      ...prev,
                      search: label,
                      pageNo: 0,
                    }));
                    break;
                }
              }}
            />
          </div>
          {/* <div className="ml-auto">
            <Button
              size={"md"}
              onClick={() =>
                setIsOpenPayDebt({
                  isOpen: true,
                  editId: undefined,
                })
              }
            >
              New debt
            </Button>
          </div> */}
        </div>
        <Suspense>
          <TableFilter
            key={debtType + orderDebtPageId}
            numberTitle="Total debt: "
            columns={actions?.columns ?? []}
            dataHook={actions?.dataHook ?? (() => ({ data: undefined }))}
            paramsKey={actions?.paramsKey ?? ""}
            search={search}
            onRowClick={onRowClick}
            paramsDefault={{
              ...DEFAULT_PAGINATION_PARAMS,
              orderId: orderDebtPageId,
              importId: orderDebtPageId,
              deliveryId: orderDebtPageId,
            }}
            actions={tableActions}
          />
        </Suspense>
      </div>
    </>
  );
}
