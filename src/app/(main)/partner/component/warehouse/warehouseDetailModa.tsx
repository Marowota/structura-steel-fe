import { Modal, ModalHeader, ModalSection } from "@/components/elements";
import { useGetWarehouseDetailByPartner } from "../../api/getWarehouseDetailByPartner";
import dayjs from "dayjs";

export const WarehouseDetailModal = ({
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
  const { data } = useGetWarehouseDetailByPartner({
    params: { partnerId, warehouseId: id },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="Warehouse detail"></ModalHeader>
      <div className="mt-2 flex min-w-[400px] flex-col gap-4">
        <ModalSection title="Warehouse Information">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Warehouse Name:</span>
              <span className="text-sm">{data?.warehouseName ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Warehouse Code:</span>
              <span className="text-sm">{data?.warehouseCode ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Warehouse Address:</span>
              <span className="text-sm">{data?.warehouseAddress ?? "-"}</span>
            </div>{" "}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Created At:</span>
              <span className="text-sm">
                {dayjs(data?.createdAt).format("HH:mm:ss - DD/MM/YYYY") ?? "-"}
              </span>
            </div>
          </div>
        </ModalSection>
      </div>
    </Modal>
  );
};
