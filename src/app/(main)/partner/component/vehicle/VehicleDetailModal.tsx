import { Modal, ModalHeader, ModalSection } from "@/components/elements";
import { useGetVehicleDetailByPartner } from "../../api/getVehiclesDetailByPartner";
import {
  EVehicleType,
  EVehicleTypeLabel,
} from "../../api/getVehiclesByPartner";

export const VehicleDetailModal = ({
  isOpen,
  onClose,
  id,
  partnerId,
}: {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
  partnerId?: string;
}) => {
  const { data } = useGetVehicleDetailByPartner({
    params: { partnerId, vehicleId: id },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="Vehicle detail"></ModalHeader>
      <div className="mt-2 flex min-w-[400px] flex-col gap-4">
        <ModalSection title="Vehicle Information">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Driver Name:</span>
              <span className="text-sm">{data?.driverName ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Vehicle Code:</span>
              <span className="text-sm">{data?.vehicleCode ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Vehicle Type:</span>
              <span className="text-sm">
                {EVehicleTypeLabel.get(
                  data?.vehicleType ?? EVehicleType.UNSPECIFIED,
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">License Plate:</span>
              <span className="text-sm">{data?.licensePlate ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Capacity:</span>
              <span className="text-sm">{data?.capacity ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Description:</span>
              <span className="text-sm">{data?.description ?? "-"}</span>
            </div>
          </div>
        </ModalSection>
      </div>
    </Modal>
  );
};
