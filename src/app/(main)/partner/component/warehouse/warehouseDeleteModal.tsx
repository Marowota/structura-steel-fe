import { Button, Modal, ModalHeader } from "@/components/elements";
import { useGetWarehouseDetailByPartner } from "../../api/getWarehouseDetailByPartner";
import { useDeleteWarehouse } from "../../api/deleteWarehouse";

export const WarehouseDeleteModal = ({
  isOpen,
  onClose,
  deleteId,
  partnerId,
}: {
  isOpen: boolean;
  onClose: () => void;
  deleteId?: string;
  partnerId?: string;
}) => {
  const { data, isLoading } = useGetWarehouseDetailByPartner({
    params: { partnerId, warehouseId: deleteId },
  });

  const { mutateAsync: deleteWarehouse } = useDeleteWarehouse();

  const onDelete = async () => {
    deleteWarehouse({
      partnerId: partnerId ?? "",
      warehouseId: deleteId ?? "",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalHeader title="Delete Warehouse" className="text-red-800" />
      <div className="mt-2 flex min-w-[400px] flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">
            Are you sure you want to delete warehouse
            <span className="text-brand-800">
              {} {data?.warehouseName} ({data?.warehouseCode})
            </span>
            ?
          </span>

          <span className="text-sm">This action cannot be undone.</span>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => onClose()}
          type="button"
          size={"sm"}
          variant={"secondary"}
        >
          Cancel
        </Button>
        <Button
          size={"sm"}
          variant={"destructive"}
          disabled={isLoading}
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};
