import { Button, Input } from "@/components/elements";
import { Modal } from "@/components/elements/modal";
import { ModalHeader } from "@/components/elements/modalHeader";
import { ModalSection } from "@/components/elements/modalSection";
import { useForm } from "react-hook-form";
import { PostProductDTO, usePostProduct } from "../api/postProducts";
import { useGetProductDetail } from "../api/getProductsDetail";
import { useEffect } from "react";
import { usePutProduct } from "../api/putProducts";

export const NewProductModal = ({
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
  } = useForm<PostProductDTO>();
  const { data: editData, isLoading } = useGetProductDetail({
    params: { id: editId },
  });
  const { mutateAsync: createProduct } = usePostProduct();
  const { mutateAsync: updateProduct } = usePutProduct();

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

  useEffect(() => {
    reset(editData);
  }, [editData]);

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler}>
      <div className="flex flex-col gap-2">
        <ModalHeader title={`${editId ? "Edit" : "New"} Product`} />
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <ModalSection title="General Information">
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <Input
                  label="Name"
                  className="text-sm-regular"
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
              <div>
                <Input
                  label="Code"
                  className="text-sm-regular"
                  required
                  {...register("code", { required: "Code is required" })}
                  isError={errors.code ? true : false}
                  errorMessage={errors.code?.message}
                />
              </div>
              <div>
                <Input
                  label="Standard"
                  className="text-sm-regular"
                  {...register("standard")}
                />
              </div>
            </div>
          </ModalSection>

          <ModalSection title="Product Dimensions">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Input
                  label="Length"
                  type="number"
                  step="any"
                  className="text-sm-regular [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  required
                  isError={errors.length ? true : false}
                  errorMessage={errors.length?.message}
                  {...register("length", { required: "Length is required" })}
                />
              </div>
              <div>
                <Input
                  label="Width"
                  type="number"
                  step="any"
                  className="text-sm-regular [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  {...register("width")}
                />
              </div>
              <div>
                <Input
                  label="Height"
                  type="number"
                  step="any"
                  className="text-sm-regular [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  {...register("height")}
                />
              </div>
              <div>
                <Input
                  label="Unit Weight"
                  type="number"
                  step="any"
                  className="text-sm-regular [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  {...register("unitWeight")}
                />
              </div>
              <div>
                <Input
                  label="Thickness"
                  type="number"
                  step="any"
                  className="text-sm-regular [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  {...register("thickness")}
                />
              </div>
              <div>
                <Input
                  label="Diameter"
                  type="number"
                  step="any"
                  className="text-sm-regular [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  {...register("diameter")}
                />
              </div>
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
