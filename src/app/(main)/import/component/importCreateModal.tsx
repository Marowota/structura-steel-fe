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
import { mapArrayToTDropdown } from "@/components/elements/dropdown";
import {
  GetPartnersDTO,
  useGetInfinitePartners,
} from "../../partner/api/getPartners";
import { DEFAULT_PAGINATION_RESPONSE, IPagination } from "@/types/IPagination";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DEFAULT_ORDER, PostImportDTO, usePostImport } from "../api/postImport";
import {
  GetProductsDTO,
  useGetInfiniteProducts,
} from "../../product/api/getProducts";
import { Plus, X } from "lucide-react";
import { EToastType, toastNotification } from "@/lib";
import { useGetImportDetail } from "../api/getImportsDetails";
import { useGetImportProduct } from "../api/getImportsProduct";
import { PostImportProductDTO } from "../api/postImportsProduct";
import { usePostImportProductBatch } from "../api/postImportsProductBatch";
import { usePostImportDebtBatch } from "../../debt/api/importDebt/postImportDebtBatch";
import { PostImportDebtDTO } from "../../debt/api/importDebt/postImportDebt";
import { GetOrdersDTO, useGetInfiniteOrders } from "../../order/api/getOrders";
import { useGetOrderProduct } from "../../order/api/getOrdersProduct";
import { getProductDetail } from "../../product/api/getProductsDetail";
import { PartnerCreateModal } from "../../partner/component/partner/partnerCreateModal";

export const ImportCreateModal = ({
  isOpen,
  onClose,
  onCloseOtherModal,
  editId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCloseOtherModal: () => void;
  editId?: string;
}) => {
  const [isOpenCreatePartner, setIsOpenCreatePartner] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
    control,
  } = useForm<
    PostImportDTO & {
      products: (PostImportProductDTO & { exportPrice?: number })[];
    }
  >();

  const { data: editImportData, isLoading: isEditOderLoading } =
    useGetImportDetail({
      params: { id: editId ?? "" },
    });
  const { data: editImportProducts, isLoading: isEditImportProductsLoading } =
    useGetImportProduct({
      params: { id: editId ?? "", all: true },
    });
  const isLoading = isEditOderLoading || isEditImportProductsLoading;

  useEffect(() => {
    if (editImportData && editImportProducts?.content) {
      const newData: PostImportDTO & { products: PostImportProductDTO[] } = {
        supplierId: editImportData.supplier.id,
        saleOrderId: editImportData.saleOrderId,
        purchaseOrdersNote: editImportData.purchaseOrdersNote,
        products: editImportProducts.content.map((importProduct) => ({
          importId: editImportData.id,
          name: importProduct.product.name,
          productId: importProduct.product.id,
          quantity: importProduct.quantity,
          unitPrice: importProduct.unitPrice,
        })),
      };

      reset(newData);
    }
  }, [editImportData, editImportProducts]);

  const { mutateAsync: createImport } = usePostImport();
  const { mutateAsync: createImportProduct } = usePostImportProductBatch();
  const { mutateAsync: createImportDebtBatch } = usePostImportDebtBatch();

  const currentProducts = watch("products");
  const currentOrderId = watch("saleOrderId");

  const defaultParams: IPagination = {
    pageNo: 0,
    pageSize: 10,
    sortBy: "",
    sortDir: "asc",
    search: "",
  };

  const { data: orderProductsData } = useGetOrderProduct({
    params: { id: currentOrderId ?? "", all: true },
  });

  useEffect(() => {
    if (currentOrderId && orderProductsData?.content) {
      const newProducts: PostImportProductDTO[] = orderProductsData.content.map(
        (orderProduct) => ({
          importId: "",
          productId: orderProduct.productId,
          quantity: orderProduct.quantity,
          unitPrice: orderProduct.product.importPrice,
          exportPrice: orderProduct.product.exportPrice,
          name: orderProduct.product.name,
        }),
      );
      setValue("products", newProducts);
    }
    if (!currentOrderId) {
      setValue("products", []);
    }
    setIsLatestProductInfo(false);
  }, [currentOrderId, orderProductsData?.content]);

  const [isLatestProductInfo, setIsLatestProductInfo] = useState(false);

  useEffect(() => {
    if (isLatestProductInfo || !currentProducts || currentProducts.length <= 0)
      return;
    const newProductPromise = currentProducts.map(async (product) => {
      const latestProductInformation = await getProductDetail({
        id: product.productId,
      });
      return {
        ...product,
        unitPrice: latestProductInformation.importPrice,
        exportPrice: latestProductInformation.exportPrice,
        name: latestProductInformation.name,
      };
    });
    Promise.all(newProductPromise).then((resolvedProducts) => {
      setValue("products", resolvedProducts);
    });
    setIsLatestProductInfo(true);
  }, [isLatestProductInfo, currentProducts]);

  const [supplierParams, setSupplierParams] = useState<GetPartnersDTO>({
    ...defaultParams,
    sortBy: "partnerName",
  });
  const [orderParams, setOrderParams] = useState<GetOrdersDTO>({
    ...defaultParams,
    sortBy: "exportCode",
  });
  const [productParams, setProductParams] = useState<GetProductsDTO>({
    ...defaultParams,
    sortBy: "name",
  });

  const {
    data: infiniteSuppliers,
    fetchNextPage: fetchNextPageSuppliers,
    isFetchingNextPage: isSuppliersLoading,
  } = useGetInfinitePartners({
    params: supplierParams,
  });

  const {
    data: infiniteOrders,
    fetchNextPage: fetchNextPageOrders,
    isFetchingNextPage: isOrdersLoading,
  } = useGetInfiniteOrders({
    params: orderParams,
  });

  const {
    data: infiniteProducts,
    fetchNextPage: fetchNextPageProducts,
    isFetchingNextPage: isProductsLoading,
  } = useGetInfiniteProducts({ params: productParams });

  const suppliers = useMemo(() => {
    const lastPage =
      infiniteSuppliers?.pages?.[infiniteSuppliers.pages.length - 1] ??
      DEFAULT_PAGINATION_RESPONSE;
    return {
      ...lastPage,
      content: infiniteSuppliers?.pages
        ? infiniteSuppliers.pages.map((page) => page.content).flat()
        : [],
    };
  }, [infiniteSuppliers]);

  const orders = useMemo(() => {
    const lastPage =
      infiniteOrders?.pages?.[infiniteOrders.pages.length - 1] ??
      DEFAULT_PAGINATION_RESPONSE;
    return {
      ...lastPage,
      content: infiniteOrders?.pages
        ? [
            DEFAULT_ORDER,
            ...infiniteOrders.pages.map((page) => page.content).flat(),
          ]
        : [],
    };
  }, [infiniteOrders]);

  const products = useMemo(() => {
    const lastPage =
      infiniteProducts?.pages?.[infiniteProducts.pages.length - 1] ??
      DEFAULT_PAGINATION_RESPONSE;
    return {
      ...lastPage,
      content: infiniteProducts?.pages
        ? infiniteProducts.pages.map((page) => page.content).flat()
        : [],
    };
  }, [infiniteProducts]);

  const onSubmit = async (
    data: PostImportDTO & { products: PostImportProductDTO[] },
  ) => {
    const { products, ...rest } = data;
    const result = await createImport({
      ...rest,
      saleOrderId: data.saleOrderId == DEFAULT_ORDER.id ? "" : data.saleOrderId,
    });
    if (result) {
      console.log(result);
      products[0].importId = result.id;
      const importProductResult = await createImportProduct(products);
      await createImportDebtBatch(
        importProductResult.map(
          (importData) =>
            ({
              importId: result.id,
              productId: importData.productId.toString(),
              originalAmount: importData.subtotal,
              debtNote: "",
            }) as PostImportDebtDTO,
        ),
      );
      onCloseHandler();
    } else {
      toastNotification(
        "failed to create import, please try again",
        EToastType.ERROR,
      );
    }
  };

  const onCloseHandler = () => {
    reset({});
    onClose();
  };

  return (
    <>
      <PartnerCreateModal
        isOpen={isOpenCreatePartner}
        onClose={() => {
          setIsOpenCreatePartner(false);
          onCloseOtherModal();
        }}
        editId={undefined}
      />
      <Modal
        isOpen={isOpen}
        onClose={onCloseHandler}
        className="flex h-[70vh] min-h-fit flex-col gap-2"
      >
        <ModalHeader title="Create Import" />
        <form
          className="flex h-full flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex h-full min-h-0 flex-row gap-4">
            <ModalSection title="General Information" className="overflow-auto">
              <div className="flex min-w-72 flex-col gap-2">
                <div className="flex items-end gap-2">
                  <Controller
                    control={control}
                    name="supplierId"
                    rules={{ required: "Supplier is required" }}
                    render={({ field: { onChange, value } }) => (
                      <InputSearch
                        label="Supplier"
                        defaultValue={editImportData?.supplier?.partnerName}
                        outerValue={value}
                        options={mapArrayToTDropdown(
                          suppliers?.content ?? [],
                          "partnerName",
                          "id",
                        )}
                        paginationInfo={suppliers}
                        onSearch={(label) => {
                          setSupplierParams((prev) => ({
                            ...prev,
                            search: label,
                            pageNo: 0,
                          }));
                        }}
                        onPageChange={() => {
                          fetchNextPageSuppliers();
                        }}
                        onItemSelect={(item) => {
                          onChange(item.value);
                        }}
                        required
                        isError={errors.supplierId ? true : false}
                        errorMessage={errors.supplierId?.message}
                        isLoading={isSuppliersLoading}
                      />
                    )}
                  />
                  {!editId && (
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        setIsOpenCreatePartner(true);
                        onClose();
                      }}
                      type="button"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Controller
                  control={control}
                  name="saleOrderId"
                  rules={{ required: "Sale Order is required" }}
                  render={({ field: { onChange, value } }) => (
                    <InputSearch
                      label="Sale Order"
                      defaultValue={editImportData?.saleOrderId}
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
                      }}
                      required
                      isError={errors.saleOrderId ? true : false}
                      errorMessage={errors.saleOrderId?.message}
                      isLoading={isOrdersLoading}
                    />
                  )}
                />
                <Textarea label="Note" {...register("purchaseOrdersNote")} />
              </div>
            </ModalSection>
            <ModalSection title="Products" className="w-[40vw]">
              <InputSearch
                placeholder="Search"
                options={mapArrayToTDropdown(
                  products?.content ?? [],
                  "name",
                  "id",
                )}
                paginationInfo={products}
                onSearch={(value) => {
                  setProductParams((prev) => ({
                    ...prev,
                    search: value,
                    pageNo: 0,
                  }));
                }}
                onPageChange={() => {
                  fetchNextPageProducts();
                }}
                onItemSelect={(item) => {
                  if (item.value) {
                    const existingProduct = currentProducts?.find(
                      (p) => p.productId === item.value,
                    );
                    if (existingProduct) {
                      setValue(
                        `products.${currentProducts?.indexOf(existingProduct)}.quantity`,
                        existingProduct.quantity + 1,
                      );
                      return;
                    } else {
                      const selectedProduct: PostImportProductDTO = {
                        importId: "",
                        productId: item.value,
                        quantity: 1,
                        unitPrice: 0,
                        name: item.label,
                      };
                      setValue("products", [
                        ...(currentProducts ?? []),
                        selectedProduct,
                      ]);
                      clearErrors("products");
                    }
                  }
                  setIsLatestProductInfo(false);
                }}
                {...register("products", {
                  required: "Product is required",
                })}
                resetOnSelect
                isLoading={isProductsLoading}
                isError={errors.products ? true : false}
                errorMessage={errors.products?.message}
                disabled={currentOrderId === DEFAULT_ORDER.id ? false : true}
              />
              <div className="mt-2 flex h-0 flex-grow flex-col overflow-auto">
                {currentProducts?.map((product, index) => (
                  <div key={index} className="flex flex-col gap-2 px-3">
                    <div className="border-brand-300 flex items-center gap-2 border-b py-2">
                      <div className="text-sm-medium">{product.name}</div>
                      <div className="ml-auto flex items-end gap-2">
                        <Input
                          type="number"
                          className="w-20 disabled:opacity-90"
                          label="Quantity"
                          inputSize={"sm"}
                          {...register(`products.${index}.quantity`, {
                            required: "Quantity is required",
                            min: 1,
                          })}
                          required
                          isError={
                            errors.products?.[index]?.quantity ? true : false
                          }
                          disabled={
                            currentOrderId === DEFAULT_ORDER.id ? false : true
                          }
                        />
                        <Input
                          disabled
                          type="number"
                          className="w-24 disabled:opacity-90"
                          label="Import Price"
                          inputSize={"sm"}
                          value={currentProducts?.[index]?.unitPrice ?? ""}
                          // {...register(`products.${index}.unitPrice`, {
                          //   required: "Unit Price is required",
                          //   min: 1,
                          // })}
                          required
                          isError={
                            errors.products?.[index]?.unitPrice ? true : false
                          }
                        />
                        {/* <Input
                        disabled
                        label="Export Price"
                        {...register(`products.${index}.exportPrice`)}
                      /> */}
                        <Button
                          variant={"navbar"}
                          size="sm"
                          onClick={() => {
                            const updatedProducts = currentProducts?.filter(
                              (_, i) => i !== index,
                            );
                            setValue("products", updatedProducts);
                          }}
                          type="button"
                          disabled={
                            currentOrderId === DEFAULT_ORDER.id ? false : true
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ModalSection>
          </div>
          <div className="flex items-center justify-end gap-2">
            <div className="text-md-semibold text-info-800">
              Total amount:{" "}
              {(
                (currentProducts?.reduce(
                  (acc, product) => acc + product.quantity * product.unitPrice,
                  0,
                ) as number) ?? 0
              ).toLocaleString("vi-VN")}{" "}
            </div>
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
    </>
  );
};
