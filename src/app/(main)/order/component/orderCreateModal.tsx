"use client";
import {
  Button,
  Input,
  InputSearch,
  Modal,
  ModalHeader,
  ModalSection,
} from "@/components/elements";
import { Dropdown } from "@/components/elements/dropdown";
import {
  GetPartnersDTO,
  useGetInfinitePartners,
} from "../../partner/api/getPartners";
import { DEFAULT_PAGINATION_RESPONSE, IPagination } from "@/types/IPagination";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { EOrderType, PostOrderDTO } from "../api/postOrder";
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

export const mapArrayToTDropdown = <T,>(
  inputArray: T[],
  labelField: keyof T,
  valueField: keyof T,
  selectionLabel?: ReactNode,
) => {
  console.log("inputArray", inputArray);
  console.log("labelField", labelField);
  console.log("valueField", valueField);
  const mappedArray = inputArray.map((item: T) => ({
    label: item[labelField] as string,
    value: item[valueField] as string,
    selectionLabel: selectionLabel ?? (item[labelField] as string),
  }));
  return mappedArray;
};

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
  } = useForm<PostOrderDTO & { products: PostOrderProductDTO[] }>();

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

  const { data: infinitePartners, fetchNextPage: fetchNextPagePartners } =
    useGetInfinitePartners({
      params: partnerParams,
    });

  const { data: infiniteProjects, fetchNextPage: fetchNextPageProject } =
    useGetInfiniteProjectsByPartner({ params: projectParams });

  const { data: infiniteProducts, fetchNextPage: fetchNextPageProducts } =
    useGetInfiniteProducts({ params: productParams });

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

  const onSubmit = () => {
    // Handle form submission
    console.log("Form submitted");
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
        <div className="flex h-full flex-row gap-4">
          <ModalSection title="General Information">
            <div className="flex min-w-72 flex-col gap-2">
              <InputSearch
                label="Partner"
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
                  itemSelectHandler(item.value, "partnerId");
                  setProjectParams((prev) => {
                    return {
                      ...prev,
                      pageNo: 0,
                      search: "",
                      partnerId: item.value,
                    };
                  });
                }}
                {...register("partnerId", {
                  required: "Partner is required",
                })}
                required
                isError={errors.partnerId ? true : false}
                errorMessage={errors.partnerId?.message}
              />
              <InputSearch
                label="Project"
                options={mapArrayToTDropdown(
                  projects?.content ?? [],
                  "projectName",
                  "id",
                )}
                paginationInfo={projects}
                onSearch={(value) => {
                  setProjectParams((prev) => ({
                    ...prev,
                    search: value,
                    pageNo: 0,
                  }));
                }}
                onPageChange={() => {
                  fetchNextPageProject();
                }}
                onItemSelect={(item) => {
                  itemSelectHandler(item.value, "projectId");
                }}
                {...register("projectId", {
                  required: "Project is required",
                })}
                required
                isError={errors.projectId ? true : false}
                errorMessage={errors.projectId?.message}
                disabled={!currentPartnerId}
                disabledMessage="Please select a partner first"
                key={currentPartnerId}
              />
              <Dropdown
                label="Order type"
                options={mapArrayToTDropdown(
                  Object.entries(EOrderType).map(([key, value]) => ({
                    label: value,
                    value: key,
                  })),
                  "label",
                  "value",
                )}
                onItemSelect={(item) => {
                  setValue("orderType", item.value, {
                    shouldValidate: true,
                  });
                }}
                {...register("orderType", {
                  required: "Order type is required",
                })}
                required
                isError={errors.orderType ? true : false}
                errorMessage={errors.orderType?.message}
                disabled={!currentProjectId}
              />
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
                  }
                }
              }}
              {...register("products", {
                required: "Product is required",
              })}
              resetOnSelect
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
                      >
                        <X className="h-4 w-4" type="button" />
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
          <Button size={"sm"}>{editId ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
};
