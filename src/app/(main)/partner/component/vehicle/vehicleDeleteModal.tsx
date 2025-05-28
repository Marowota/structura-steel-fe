import { Button, Modal, ModalHeader } from "@/components/elements";
import { useGetVehicleDetailByPartner } from "../../api/getVehiclesDetailByPartner";
import { useDeleteVehicle } from "../../api/deleteVehicles";

export const VehicleDeleteModal = ({
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
  const { data, isLoading } = useGetVehicleDetailByPartner({
    params: { partnerId, vehicleId: deleteId },
  });

  const { mutateAsync: deleteVehicle } = useDeleteVehicle();

  const onDelete = async () => {
    deleteVehicle({
      partnerId: partnerId ?? "",
      vehicleId: deleteId ?? "",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalHeader title="Delete Vehicle" className="text-red-800" />
      <div className="mt-2 flex min-w-[400px] flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">
            Are you sure you want to delete vehicle
            <span className="text-brand-800">
              {} {data?.licensePlate} ({data?.vehicleCode})
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
