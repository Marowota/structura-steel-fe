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
import { PostImportDTO, usePostImport } from "../api/postImport";
import {
  GetProjectsDTO,
  useGetInfiniteProjectsByPartner,
} from "../../partner/api/getProjectsByPartner";
import {
  GetProductsDTO,
  useGetInfiniteProducts,
} from "../../product/api/getProducts";
import { X } from "lucide-react";
import { EToastType, toastNotification } from "@/lib";
import { useGetImportDetail } from "../api/getImportsDetails";
import { useGetImportProduct } from "../api/getImportsProduct";
import { PostImportProductDTO } from "../api/postImportsProduct";
import { usePostImportProductBatch } from "../api/postImportsProductBatch";
import { usePostImportDebtBatch } from "../../debt/api/importDebt/postImportDebtBatch";
import { PostImportDebtDTO } from "../../debt/api/importDebt/postImportDebt";

export const ImportCreateModal = ({
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
    clearErrors,
    control,
  } = useForm<PostImportDTO & { products: PostImportProductDTO[] }>();

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
        projectId: editImportData.project.id,
        purchaseOrdersNote: editImportData.purchaseOrdersNote,
        products: editImportProducts.content.map((importProduct) => ({
          importId: editImportData.id,
          name: importProduct.product.name,
          productId: importProduct.product.id,
          quantity: importProduct.quantity,
          unitPrice: importProduct.unitPrice,
        })),
      };
      setPartnerParams((prev) => {
        return {
          ...prev,
          search: editImportData.supplier.partnerName,
          pageNo: 0,
        };
      });

      setProjectParams((prev) => {
        return {
          ...prev,
          search: editImportData.project.projectName,
          pageNo: 0,
          partnerId: editImportData.supplier.id,
        };
      });
      reset(newData);
    }
  }, [editImportData, editImportProducts]);

  const { mutateAsync: createImport } = usePostImport();
  const { mutateAsync: createImportProduct } = usePostImportProductBatch();
  const { mutateAsync: createImportDebtBatch } = usePostImportDebtBatch();

  const itemSelectHandler = (value: string, field: keyof PostImportDTO) => {
    if (value) {
      setValue(field, value, {
        shouldValidate: true,
      });
    } else {
      resetField(field);
    }
  };

  const [currentPartnerId, setCurrentPartnerId] = useState<string>();
  const currentProducts = watch("products");

  const defaultParams: IPagination = {
    pageNo: 0,
    pageSize: 10,
    sortBy: "",
    sortDir: "asc",
    search: "",
  };

  const [supplierParams, setSupplierParams] = useState<GetPartnersDTO>({
    ...defaultParams,
    sortBy: "partnerName",
  });
  const [partnerParams, setPartnerParams] = useState<GetPartnersDTO>({
    ...defaultParams,
    sortBy: "partnerName",
  });
  const [projectParams, setProjectParams] = useState<GetProjectsDTO>({
    ...defaultParams,
    partnerId: currentPartnerId,
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
    data: infinitePartners,
    fetchNextPage: fetchNextPagePartners,
    isFetchingNextPage: isPartnersLoading,
  } = useGetInfinitePartners({
    params: partnerParams,
  });

  const {
    data: infiniteProjects,
    fetchNextPage: fetchNextPageProject,
    isFetchingNextPage: isProjectsLoading,
  } = useGetInfiniteProjectsByPartner({ params: projectParams });

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

  const projects = useMemo(() => {
    const lastPage =
      infiniteProjects?.pages?.[infiniteProjects.pages.length - 1] ??
      DEFAULT_PAGINATION_RESPONSE;
    return {
      ...lastPage,
      content: infiniteProjects?.pages
        ? infiniteProjects.pages.map((page) => page.content).flat()
        : [],
    };
  }, [infiniteProjects]);

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

  useEffect(() => {
    resetField("projectId");
  }, [currentPartnerId]);

  const onSubmit = async (
    data: PostImportDTO & { products: PostImportProductDTO[] },
  ) => {
    const { products, ...rest } = data;
    const result = await createImport(rest);
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
              <InputSearch
                label="Partner"
                outerValue={currentPartnerId}
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
                  setCurrentPartnerId(item.value);
                  setProjectParams((prev) => {
                    return {
                      ...prev,
                      pageNo: 0,
                      search: "",
                      partnerId: item.value,
                    };
                  });
                }}
                required
                isLoading={isPartnersLoading}
              />
              <Controller
                control={control}
                name="projectId"
                rules={{ required: "Project is required" }}
                render={({ field: { onChange, value } }) => (
                  <InputSearch
                    label="Project"
                    outerValue={value}
                    defaultValue={editImportData?.project?.projectName}
                    options={mapArrayToTDropdown(
                      projects?.content ?? [],
                      "projectName",
                      "id",
                    )}
                    paginationInfo={projects}
                    onSearch={(label) => {
                      setProjectParams((prev) => ({
                        ...prev,
                        search: label,
                        pageNo: 0,
                      }));
                    }}
                    onPageChange={() => {
                      fetchNextPageProject();
                    }}
                    onItemSelect={(item) => {
                      itemSelectHandler(item.value, "projectId");
                      onChange(item.value);
                    }}
                    required
                    isError={errors.projectId ? true : false}
                    errorMessage={errors.projectId?.message}
                    disabled={!currentPartnerId}
                    disabledMessage="Please select a partner first"
                    isLoading={isProjectsLoading}
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
              }}
              {...register("products", {
                required: "Product is required",
              })}
              resetOnSelect
              isLoading={isProductsLoading}
              isError={errors.products ? true : false}
              errorMessage={errors.products?.message}
            />
            <div className="mt-2 flex h-0 flex-grow flex-col overflow-auto">
              {currentProducts?.map((product, index) => (
                <div key={index} className="flex flex-col gap-2 px-3">
                  <div className="border-brand-300 flex items-center gap-2 border-b py-2">
                    <div className="text-sm-medium">{product.name}</div>
                    <div className="ml-auto flex items-end gap-2">
                      <Input
                        type="number"
                        className="w-20"
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
                      />
                      <Input
                        type="number"
                        className="w-20"
                        label="Unit Price"
                        inputSize={"sm"}
                        {...register(`products.${index}.unitPrice`, {
                          required: "Unit Price is required",
                          min: 1,
                        })}
                        required
                        isError={
                          errors.products?.[index]?.unitPrice ? true : false
                        }
                      />
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
  );
};
