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
import { EOrderType, PostOrderDTO, usePostOrder } from "../api/postOrder";
import {
  GetProjectsDTO,
  useGetInfiniteProjectsByPartner,
} from "../../partner/api/getProjectsByPartner";
import {
  GetProductsDTO,
  useGetInfiniteProducts,
} from "../../product/api/getProducts";
import { PostOrderProductDTO } from "../api/postOrderProduct";
import { X } from "lucide-react";
import { usePostOrderProductBatch } from "../api/postOrderProductBatch";
import { EToastType, toastNotification } from "@/lib";
import { useGetOrderDetail } from "../api/getOrdersDetails";
import { useGetOrderProduct } from "../api/getOrdersProduct";

export const OrderCreateModal = ({
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
  } = useForm<PostOrderDTO & { products: PostOrderProductDTO[] }>();

  const { data: editOrderData, isLoading: isEditOderLoading } =
    useGetOrderDetail({
      params: { id: editId ?? "" },
    });
  const { data: editOrderProducts, isLoading: isEditOrderProductsLoading } =
    useGetOrderProduct({
      params: { id: editId ?? "", all: true },
    });
  const isLoading = isEditOderLoading || isEditOrderProductsLoading;

  useEffect(() => {
    if (editOrderData && editOrderProducts?.content) {
      const newData = {
        partnerId: editOrderData.partner.id,
        projectId: editOrderData.project.id,
        orderType: editOrderData.orderType,
        saleOrdersNote: editOrderData.saleOrdersNote,
        products: editOrderProducts.content.map((orderProduct) => ({
          orderId: editOrderData.id,
          name: orderProduct.product.name,
          productId: orderProduct.product.id,
          quantity: orderProduct.quantity,
          unitPrice: orderProduct.unitPrice,
          weight: orderProduct.weight,
        })),
      };
      setPartnerParams((prev) => {
        return {
          ...prev,
          search: editOrderData.partner.partnerName,
          pageNo: 0,
        };
      });

      setProjectParams((prev) => {
        return {
          ...prev,
          search: editOrderData.project.projectName,
          pageNo: 0,
          partnerId: editOrderData.partner.id,
        };
      });
      reset(newData);
    }
  }, [editOrderData, editOrderProducts]);

  const { mutateAsync: createOrder } = usePostOrder();
  const { mutateAsync: createOrderProduct } = usePostOrderProductBatch();

  const itemSelectHandler = (value: string, field: keyof PostOrderDTO) => {
    if (value) {
      setValue(field, value, {
        shouldValidate: true,
      });
    } else {
      resetField(field);
    }
  };

  const currentPartnerId = watch("partnerId");
  const currentProjectId = watch("projectId");
  const currentProducts = watch("products");

  const defaultParams: IPagination = {
    pageNo: 0,
    pageSize: 10,
    sortBy: "",
    sortDir: "asc",
    search: "",
  };

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
    data: PostOrderDTO & { products: PostOrderProductDTO[] },
  ) => {
    const { products, ...rest } = data;
    const result = await createOrder(rest);
    if (result) {
      console.log(result);
      products[0].orderId = result.id;
      await createOrderProduct(products);
      onCloseHandler();
    } else {
      toastNotification(
        "failed to create order, please try again",
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
      <ModalHeader title="Create Order" />
      <form
        className="flex h-full flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex h-full min-h-0 flex-row gap-4">
          <ModalSection title="General Information" className="overflow-auto">
            <div className="flex min-w-72 flex-col gap-2">
              <Controller
                control={control}
                name="partnerId"
                rules={{ required: "Partner is required" }}
                render={({ field: { onChange, value } }) => (
                  <InputSearch
                    label="Partner"
                    defaultValue={editOrderData?.partner?.partnerName}
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
                    isError={errors.partnerId ? true : false}
                    errorMessage={errors.partnerId?.message}
                    isLoading={isPartnersLoading}
                  />
                )}
              />
              <Controller
                control={control}
                name="projectId"
                rules={{ required: "Project is required" }}
                render={({ field: { onChange, value } }) => (
                  <InputSearch
                    label="Project"
                    outerValue={value}
                    defaultValue={editOrderData?.project?.projectName}
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
              <Controller
                control={control}
                name="orderType"
                rules={{ required: "Order type is required" }}
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    label="Order type"
                    options={mapArrayToTDropdown(
                      Object.entries(EOrderType).map(([, value]) => ({
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
                    isError={errors.orderType ? true : false}
                    errorMessage={errors.orderType?.message}
                    disabled={!currentProjectId}
                    outerValue={value}
                  />
                )}
              />
              <Textarea label="Note" {...register("saleOrdersNote")} />
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
                    const selectedProduct: PostOrderProductDTO = {
                      orderId: "",
                      productId: item.value,
                      quantity: 1,
                      unitPrice: 0,
                      weight: 1,
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
                          min: 0,
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
        <div className="flex justify-end gap-2">
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
