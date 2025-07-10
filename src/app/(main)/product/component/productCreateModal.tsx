import {
  Button,
  Dropdown,
  Input,
  mapArrayToTDropdown,
} from "@/components/elements";
import { Modal } from "@/components/elements/modal";
import { ModalHeader } from "@/components/elements/modalHeader";
import { ModalSection } from "@/components/elements/modalSection";
import { Controller, useForm } from "react-hook-form";
import { PostProductDTO, usePostProduct } from "../api/postProducts";
import { useGetProductDetail } from "../api/getProductsDetail";
import { useEffect } from "react";
import { usePutProduct } from "../api/putProducts";
import { EProductType, PRODUCT_TYPE_OPTIONS } from "../api/getProducts";

export const ProductCreateModal = ({
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
    formState: { errors },
    control,
    watch,
    resetField,
  } = useForm<PostProductDTO>();
  const { data: editData, isLoading } = useGetProductDetail({
    params: { id: editId },
  });
  const { mutateAsync: createProduct } = usePostProduct();
  const { mutateAsync: updateProduct } = usePutProduct();

  const currentProductType = watch("productType");

  const onCloseHandler = () => {
    reset({});
    onClose();
  };

  const onSubmit = async (data: PostProductDTO) => {
    try {
      if (editId) {
        await updateProduct({ id: editId, data });
      } else {
        await createProduct(data);
      }
      onCloseHandler();
    } catch {}
  };

  const mappingProductTypeToDisabledFields = (productType?: EProductType) => {
    switch (productType) {
      case EProductType.RIBBED_BAR:
        return new Set(["width", "height", "thickness", "unitWeight"]);
      case EProductType.COIL:
        return new Set(["height", "diameter", "unitWeight"]);
      case EProductType.WIRE_COIL:
        return new Set(["width", "height", "thickness", "unitWeight"]);
      case EProductType.PLATE:
        return new Set(["height", "diameter", "unitWeight"]);
      case EProductType.PIPE:
        return new Set(["width", "height", "unitWeight"]);
      case EProductType.BOX:
        return new Set(["diameter", "unitWeight"]);
      case EProductType.SHAPED:
        return new Set(["width", "height", "thickness", "diameter"]);
      default:
        return new Set([
          "length",
          "width",
          "height",
          "thickness",
          "diameter",
          "unitWeight",
        ]);
    }
  };

  const currentDisabledFields =
    mappingProductTypeToDisabledFields(currentProductType);
  const currentImportPrice = watch("importPrice");
  const currentProfitPercentage = watch("profitPercentage");

  useEffect(() => {
    reset(editData);
  }, [editData]);

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler}>
      <div className="flex flex-col gap-2">
        <ModalHeader title={`${editId ? "Edit" : "New"} Product`} />
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-2">
            <ModalSection title="General Information">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <Input
                    label="Name"
                    required
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    isError={errors.name ? true : false}
                    errorMessage={errors.name?.message}
                  />
                </div>
                <Controller
                  control={control}
                  name="productType"
                  rules={{ required: "Product type is required" }}
                  render={({ field: { onChange, value } }) => (
                    <Dropdown
                      label="Product Type"
                      required
                      options={mapArrayToTDropdown(
                        Object.entries(EProductType).map(([, value]) => ({
                          label: PRODUCT_TYPE_OPTIONS.get(value) || value,
                          value: value,
                        })),
                        "label",
                        "value",
                      )}
                      outerValue={value}
                      onItemSelect={(item) => {
                        onChange(item.value);
                        mappingProductTypeToDisabledFields().forEach(
                          (field) => {
                            resetField(field as keyof PostProductDTO);
                          },
                        );
                      }}
                      isError={errors.productType ? true : false}
                      errorMessage={errors.productType?.message}
                    />
                  )}
                />
                <Input label="Standard" {...register("standard")} />
              </div>
            </ModalSection>
            <ModalSection title="Pricing Information">
              <div className="flex flex-col gap-2">
                <Input
                  label="Import Price (VND)"
                  type="number"
                  step="any"
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  isError={errors.importPrice ? true : false}
                  errorMessage={errors.importPrice?.message}
                  {...register("importPrice", {
                    required: "Import Price is required",
                  })}
                  required
                />
                <Input
                  label="Profit Percentage (%)"
                  type="number"
                  step="any"
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  isError={errors.profitPercentage ? true : false}
                  errorMessage={errors.profitPercentage?.message}
                  {...register("profitPercentage", {
                    required: "Profit Percentage is required",
                  })}
                  required
                />
                Export price:{" "}
                {currentImportPrice *
                  (1 + (currentProfitPercentage ?? 0) / 100)}
              </div>
            </ModalSection>
          </div>

          <ModalSection title="Product Dimensions">
            <div className="grid grid-cols-3 gap-2">
              <Input
                label="Length (m)"
                type="number"
                step="any"
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                isError={errors.length ? true : false}
                errorMessage={errors.length?.message}
                {...register("length", {
                  required: currentDisabledFields.has("length")
                    ? false
                    : "Length is required",
                })}
                required={!currentDisabledFields.has("length")}
                disabled={currentDisabledFields.has("length")}
              />
              <Input
                label="Width (mm)"
                type="number"
                step="any"
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                isError={errors.width ? true : false}
                errorMessage={errors.width?.message}
                {...register("width", {
                  required: currentDisabledFields.has("width")
                    ? false
                    : "Width is required",
                })}
                required={!currentDisabledFields.has("width")}
                disabled={currentDisabledFields.has("width")}
              />
              <Input
                label="Height (mm)"
                type="number"
                step="any"
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                isError={errors.height ? true : false}
                errorMessage={errors.height?.message}
                {...register("height", {
                  required: currentDisabledFields.has("height")
                    ? false
                    : "Height is required",
                })}
                required={!currentDisabledFields.has("height")}
                disabled={currentDisabledFields.has("height")}
              />
              <Input
                label="Unit Weight (kg/m)"
                type="number"
                step="any"
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                isError={errors.unitWeight ? true : false}
                errorMessage={errors.unitWeight?.message}
                {...register("unitWeight", {
                  required: currentDisabledFields.has("unitWeight")
                    ? false
                    : "Unit Weight is required",
                })}
                required={!currentDisabledFields.has("unitWeight")}
                disabled={currentDisabledFields.has("unitWeight")}
              />
              <Input
                label="Thickness (mm)"
                type="number"
                step="any"
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                isError={errors.thickness ? true : false}
                errorMessage={errors.thickness?.message}
                {...register("thickness", {
                  required: currentDisabledFields.has("thickness")
                    ? false
                    : "Thickness is required",
                })}
                required={!currentDisabledFields.has("thickness")}
                disabled={currentDisabledFields.has("thickness")}
              />
              <Input
                label="Diameter (mm)"
                type="number"
                step="any"
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                isError={errors.diameter ? true : false}
                errorMessage={errors.diameter?.message}
                {...register("diameter", {
                  required: currentDisabledFields.has("diameter")
                    ? false
                    : "Diameter is required",
                })}
                required={!currentDisabledFields.has("diameter")}
                disabled={currentDisabledFields.has("diameter")}
              />
            </div>
          </ModalSection>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => onCloseHandler()}
              type="button"
              size={"sm"}
              variant={"secondary"}
            >
              Cancel
            </Button>
            <Button size={"sm"} disabled={isLoading}>
              {editId ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
