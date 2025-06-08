"use client";
import {
  Button,
  Input,
  InputSearch,
  Modal,
  ModalHeader,
  ModalSection,
  Textarea,
} from "@/components/elements";
import { Dropdown, mapArrayToTDropdown } from "@/components/elements/dropdown";
import {
  GetPartnersDTO,
  useGetInfinitePartners,
} from "../../partner/api/getPartners";
import { DEFAULT_PAGINATION_RESPONSE, IPagination } from "@/types/IPagination";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { PostDeliveryDTO, usePostDelivery } from "../api/postDelivery";
import { useGetDeliveryDetail } from "../api/getDeliveriesDetails";
import {
  GetVehiclesDTO,
  useGetInfiniteVehiclesByPartner,
} from "../../partner/api/getVehiclesByPartner";
import { GetOrdersDTO, useGetInfiniteOrders } from "../../order/api/getOrders";
import {
  GetImportsDTO,
  useGetInfiniteImports,
} from "../../import/api/getImports";

export enum EDeliveryType {
  IMPORT = "Import",
  EXPORT = "Export",
}

export const DeliveryCreateModal = ({
  isOpen,
  onClose,
  editId,
}: {
  isOpen: boolean;
  onClose: () => void;
  editId?: string;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    resetField,
    formState: { errors },
    control,
  } = useForm<PostDeliveryDTO & { deliveryType: string }>();

  const { data: editDeliveryData, isLoading: isEditOderLoading } =
    useGetDeliveryDetail({
      params: { id: editId ?? "" },
    });
  const isLoading = isEditOderLoading;

  useEffect(() => {
    if (editDeliveryData) {
      const newData = {};
      setPartnerParams((prev) => {
        return {
          ...prev,
          search: editDeliveryData.partner?.partnerName,
          pageNo: 0,
        };
      });

      setVehicleParams((prev) => {
        return {
          ...prev,
          search: editDeliveryData.vehicle?.licensePlate,
          pageNo: 0,
          partnerId: editDeliveryData.partner?.id,
        };
      });
      reset(newData);
    }
  }, [editDeliveryData]);

  const { mutateAsync: createDelivery } = usePostDelivery();

  const itemSelectHandler = (value: string, field: keyof PostDeliveryDTO) => {
    if (value) {
      setValue(field, value, {
        shouldValidate: true,
      });
    } else {
      resetField(field);
    }
  };

  const currentDeliveryType = watch("deliveryType");
  const currentPartnerId = watch("partnerId");

  const defaultParams: IPagination = {
    pageNo: 0,
    pageSize: 10,
    sortBy: "",
    sortDir: "asc",
    search: "",
  };

  const [orderParams, setOrderParams] = useState<GetOrdersDTO>({
    ...defaultParams,
  });
  const [importParams, setImportParams] = useState<GetImportsDTO>({
    ...defaultParams,
  });
  const [partnerParams, setPartnerParams] = useState<GetPartnersDTO>({
    ...defaultParams,
    sortBy: "partnerName",
  });
  const [vehicleParams, setVehicleParams] = useState<GetVehiclesDTO>({
    ...defaultParams,
    partnerId: currentPartnerId,
  });

  const {
    data: infiniteOrders,
    fetchNextPage: fetchNextPageOrders,
    isFetchingNextPage: isOrdersLoading,
  } = useGetInfiniteOrders({
    params: orderParams,
  });

  const {
    data: infiniteImports,
    fetchNextPage: fetchNextPageImports,
    isFetchingNextPage: isImportsLoading,
  } = useGetInfiniteImports({
    params: importParams,
  });

  const {
    data: infinitePartners,
    fetchNextPage: fetchNextPagePartners,
    isFetchingNextPage: isPartnersLoading,
  } = useGetInfinitePartners({
    params: partnerParams,
  });

  const {
    data: infiniteVehicles,
    fetchNextPage: fetchNextPageVehicle,
    isFetchingNextPage: isVehiclesLoading,
  } = useGetInfiniteVehiclesByPartner({ params: vehicleParams });

  const orders = useMemo(() => {
    const lastPage =
      infiniteOrders?.pages?.[infiniteOrders.pages.length - 1] ??
      DEFAULT_PAGINATION_RESPONSE;
    return {
      ...lastPage,
      content: infiniteOrders?.pages
        ? infiniteOrders.pages.map((page) => page.content).flat()
        : [],
    };
  }, [infiniteOrders]);

  const imports = useMemo(() => {
    const lastPage =
      infiniteImports?.pages?.[infiniteImports.pages.length - 1] ??
      DEFAULT_PAGINATION_RESPONSE;
    return {
      ...lastPage,
      content: infiniteImports?.pages
        ? infiniteImports.pages.map((page) => page.content).flat()
        : [],
    };
  }, [infiniteImports]);

  const partners = useMemo(() => {
    const lastPage =
      infinitePartners?.pages?.[infinitePartners.pages.length - 1] ??
      DEFAULT_PAGINATION_RESPONSE;
    return {
      ...lastPage,
      content: infinitePartners?.pages
        ? infinitePartners.pages.map((page) => page.content).flat()
        : [],
    };
  }, [infinitePartners]);

  const vehicles = useMemo(() => {
    const lastPage =
      infiniteVehicles?.pages?.[infiniteVehicles.pages.length - 1] ??
      DEFAULT_PAGINATION_RESPONSE;
    return {
      ...lastPage,
      content: infiniteVehicles?.pages
        ? infiniteVehicles.pages.map((page) => page.content).flat()
        : [],
    };
  }, [infiniteVehicles]);

  useEffect(() => {
    resetField("vehicleId");
  }, [currentPartnerId]);

  const onSubmit = async (data: PostDeliveryDTO & { deliveryType: string }) => {
    const submitData = { ...data, deliveryType: undefined };
    if (data.deliveryType === EDeliveryType.EXPORT) {
      data.purchaseOrderId = undefined;
    }
    if (data.deliveryType === EDeliveryType.IMPORT) {
      data.saleOrderId = undefined;
    }
    createDelivery(submitData);
    onCloseHandler();
  };

  const onCloseHandler = () => {
    reset({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseHandler}
      className="flex h-[70vh] min-h-fit flex-col gap-2"
    >
      <ModalHeader title={`${editId ? "Update" : "Create"} Delivery`} />
      <form
        className="flex h-full flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex h-full min-h-0 flex-row gap-4">
          <ModalSection title="General Information" className="overflow-auto">
            <div className="grid min-w-72 grid-cols-2 gap-2">
              <Controller
                control={control}
                name="deliveryType"
                rules={{ required: "Delivery type is required" }}
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    label="Type"
                    outerValue={value}
                    options={mapArrayToTDropdown(
                      Object.entries(EDeliveryType).map(([, value]) => ({
                        label: value,
                        value: value,
                      })),
                      "label",
                      "value",
                    )}
                    onItemSelect={(item) => {
                      onChange(item.value);
                    }}
                    required
                    isError={errors.deliveryType ? true : false}
                    errorMessage={errors.deliveryType?.message}
                  />
                )}
              />

              {(currentDeliveryType === EDeliveryType.EXPORT ||
                currentDeliveryType !== EDeliveryType.IMPORT) && (
                <Controller
                  control={control}
                  name="saleOrderId"
                  rules={{ required: "Order is required" }}
                  render={({ field: { onChange, value } }) => (
                    <InputSearch
                      label="Export Order"
                      defaultValue={editDeliveryData?.saleOrderId}
                      outerValue={value}
                      options={mapArrayToTDropdown(
                        orders?.content ?? [],
                        "exportCode",
                        "id",
                      )}
                      paginationInfo={orders}
                      onSearch={(label) => {
                        setOrderParams((prev) => ({
                          ...prev,
                          search: label,
                          pageNo: 0,
                        }));
                      }}
                      onPageChange={() => {
                        fetchNextPageOrders();
                      }}
                      onItemSelect={(item) => {
                        onChange(item.value);
                        setOrderParams((prev) => {
                          return {
                            ...prev,
                            pageNo: 0,
                            search: "",
                          };
                        });
                      }}
                      required
                      isError={errors.saleOrderId ? true : false}
                      errorMessage={errors.saleOrderId?.message}
                      isLoading={isOrdersLoading}
                      disabled={currentDeliveryType !== EDeliveryType.EXPORT}
                    />
                  )}
                />
              )}

              {currentDeliveryType === EDeliveryType.IMPORT && (
                <Controller
                  control={control}
                  name="purchaseOrderId"
                  rules={{ required: "Order is required" }}
                  render={({ field: { onChange, value } }) => (
                    <InputSearch
                      label="Import Order"
                      defaultValue={editDeliveryData?.purchaseOrderId}
                      outerValue={value}
                      options={mapArrayToTDropdown(
                        imports?.content ?? [],
                        "importCode",
                        "id",
                      )}
                      paginationInfo={imports}
                      onSearch={(label) => {
                        setImportParams((prev) => ({
                          ...prev,
                          search: label,
                          pageNo: 0,
                        }));
                      }}
                      onPageChange={() => {
                        fetchNextPageImports();
                      }}
                      onItemSelect={(item) => {
                        onChange(item.value);
                        setImportParams((prev) => {
                          return {
                            ...prev,
                            pageNo: 0,
                            search: "",
                          };
                        });
                      }}
                      required
                      isError={errors.purchaseOrderId ? true : false}
                      errorMessage={errors.purchaseOrderId?.message}
                      isLoading={isImportsLoading}
                    />
                  )}
                />
              )}

              <Controller
                control={control}
                name="partnerId"
                rules={{ required: "Partner is required" }}
                render={({ field: { onChange, value } }) => (
                  <InputSearch
                    label="Delivery Partner"
                    defaultValue={editDeliveryData?.partner?.partnerName}
                    outerValue={value}
                    options={mapArrayToTDropdown(
                      partners?.content ?? [],
                      "partnerName",
                      "id",
                    )}
                    paginationInfo={partners}
                    onSearch={(label) => {
                      setPartnerParams((prev) => ({
                        ...prev,
                        search: label,
                        pageNo: 0,
                      }));
                    }}
                    onPageChange={() => {
                      fetchNextPagePartners();
                    }}
                    onItemSelect={(item) => {
                      onChange(item.value);
                      setVehicleParams((prev) => {
                        return {
                          ...prev,
                          pageNo: 0,
                          search: "",
                          partnerId: item.value,
                        };
                      });
                    }}
                    required
                    isError={errors.partnerId ? true : false}
                    errorMessage={errors.partnerId?.message}
                    isLoading={isPartnersLoading}
                  />
                )}
              />
              <Controller
                control={control}
                name="vehicleId"
                rules={{ required: "Vehicle is required" }}
                render={({ field: { onChange, value } }) => (
                  <InputSearch
                    label="Vehicle"
                    outerValue={value}
                    defaultValue={editDeliveryData?.vehicle?.licensePlate}
                    options={mapArrayToTDropdown(
                      vehicles?.content ?? [],
                      "licensePlate",
                      "id",
                    )}
                    paginationInfo={vehicles}
                    onSearch={(label) => {
                      setVehicleParams((prev) => ({
                        ...prev,
                        search: label,
                        pageNo: 0,
                      }));
                    }}
                    onPageChange={() => {
                      fetchNextPageVehicle();
                    }}
                    onItemSelect={(item) => {
                      itemSelectHandler(item.value, "vehicleId");
                      onChange(item.value);
                    }}
                    required
                    isError={errors.vehicleId ? true : false}
                    errorMessage={errors.vehicleId?.message}
                    disabled={!currentPartnerId}
                    disabledMessage="Please select a partner first"
                    isLoading={isVehiclesLoading}
                  />
                )}
              />
              <Input label="Driver Name" {...register("driverName")} />
              <Input
                type="date"
                label="Delivery Date"
                {...register("deliveryDate")}
              />
              <Input
                label="Delivery Address"
                {...register("deliveryAddress")}
              />
              <Input
                label="Distance (km)"
                type="number"
                {...register("distance", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Distance cannot be negative",
                  },
                })}
              />
            </div>
          </ModalSection>
          <ModalSection title="Fee Information" className="overflow-auto">
            <Input
              label="Unit Price"
              type="number"
              {...register("deliveryUnitPrice", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Unit price cannot be negative",
                },
              })}
            />
            <Input
              label="Additional Fees"
              type="number"
              {...register("additionalFees", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Additional fees cannot be negative",
                },
              })}
            />
            <Input
              label="Total Delivery Fee"
              type="number"
              {...register("totalDeliveryFee", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Total delivery fee cannot be negative",
                },
              })}
            />
            <Textarea label="Note" {...register("deliveryOrderNote")} />
          </ModalSection>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            onClick={() => onCloseHandler()}
            type="button"
            size={"sm"}
            variant={"secondary"}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} size={"sm"}>
            {editId ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
