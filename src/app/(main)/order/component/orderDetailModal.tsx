import { Modal, ModalHeader, ModalSection } from "@/components/elements";
import { useGetOrderDetail } from "../api/getOrdersDetails";

export const OrderDetailModal = ({
  isOpen,
  onClose,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
}) => {
  const { data } = useGetOrderDetail({
    params: { id },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="h-[60vh] min-h-fit w-[60vw]"
    >
      <ModalHeader title="Order detail"></ModalHeader>
      <div className="mt-2 flex h-full flex-col gap-4">
        <div className="flex h-full gap-4">
          <ModalSection
            title="General Information"
            className="flex w-1/3 flex-col gap-4"
          >
            <div>
              <span className="text-sm-semibold">Code: </span>
              {data?.exportCode}
            </div>
            <div>
              <span className="text-sm-semibold">Partner: </span>
              {data?.partner?.partnerName}
            </div>
            <div>
              <span className="text-sm-semibold">Project: </span>
              {data?.project?.projectName}
            </div>
            <div>
              <span className="text-sm-semibold">Order note: </span>
              {data?.saleOrdersNote}
            </div>
          </ModalSection>
          <ModalSection title="Products" className="w-2/3">
            <div className="flex flex-col gap-4 overflow-auto">
              {data?.saleOrderDetails?.map((detail) => (
                <div className="flex" key={detail.id}>
                  <div className="text-sm-semibold">{detail.product.name}</div>
                  <div className="ml-auto">
                    quantity: {detail.quantity} - unit price:{" "}
                    {(
                      (detail.product.exportPrice as number) ?? 0
                    ).toLocaleString("vi-VN")}{" "}
                    VND - weight {detail.weight} kg
                  </div>
                </div>
              ))}
            </div>
            <div className="text-md-semibold text-info-800 mt-auto self-end">
              Total amount:{" "}
              {((data?.totalAmount as number) ?? 0).toLocaleString("vi-VN")}
            </div>
          </ModalSection>
        </div>
      </div>
    </Modal>
  );
};
