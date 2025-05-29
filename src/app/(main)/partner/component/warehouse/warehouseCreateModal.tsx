import { Button, Input } from "@/components/elements";
import { Modal } from "@/components/elements/modal";
import { ModalHeader } from "@/components/elements/modalHeader";
import { ModalSection } from "@/components/elements/modalSection";
import { useForm } from "react-hook-form";
import { PostWarehouseDTO, usePostWarehouse } from "../../api/postWarehouse";
import { useEffect } from "react";
import { useGetWarehouseDetailByPartner } from "../../api/getWarehouseDetailByPartner";
import { usePutWarehouse } from "../../api/putWarehouse";

export const WarehouseCreateModal = ({
  isOpen,
  onClose,
  editId,
  partnerId,
}: {
  isOpen: boolean;
  onClose: () => void;
  editId: undefined | string;
  partnerId: string;
}) => {
  const { handleSubmit, reset, register } = useForm<PostWarehouseDTO>({
    defaultValues: { partnerId },
  });
  const { data: editData, isLoading } = useGetWarehouseDetailByPartner({
    params: { partnerId: partnerId, warehouseId: editId },
  });
  const { mutateAsync: createWarehouse } = usePostWarehouse();
  const { mutateAsync: updateWarehouse } = usePutWarehouse();

  const onCloseHandler = () => {
    reset({});
    onClose();
  };

  const onSubmit = async (data: PostWarehouseDTO) => {
    try {
      if (editId) {
        await updateWarehouse({
          ...data,
          warehouseId: editId,
          partnerId: partnerId,
        });
      } else {
        await createWarehouse({ ...data, partnerId: partnerId });
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
        <ModalHeader title={`${editId ? "Edit" : "New"} Warehouse`} />
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <ModalSection title="Warehouse Information">
            <div className="grid w-[400px] gap-2">
              <Input label="Warehouse Name" {...register("warehouseName")} />
              <Input
                label="Warehouse Address"
                {...register("warehouseAddress")}
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
