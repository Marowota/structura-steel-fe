import { Button, Modal, ModalHeader } from "@/components/elements";
import { useForm } from "react-hook-form";
import {
  EConfirmation,
  PutConfirmDeliveryDTO,
  usePutConfirmDelivery,
} from "../api/putConfirmDelivery";
import { useGetDeliveryDetail } from "../api/getDeliveriesDetails";
import { EDeliveryType } from "../api/getDeliveries";
import { useEffect } from "react";

export const DeliveryConfirmModal = ({
  isOpen,
  onClose,
  confirmId,
}: {
  isOpen: boolean;
  onClose: () => void;
  confirmId?: string;
}) => {
  const { setValue, handleSubmit, reset } = useForm<PutConfirmDeliveryDTO>({
    defaultValues: {
      deliveryId: confirmId ?? "",
      confirmationFromSender: EConfirmation.PENDING,
      confirmationFromReceiver: EConfirmation.PENDING,
      confirmationFromFactory: EConfirmation.PENDING,
      confirmationFromPartner: EConfirmation.PENDING,
    },
  });

  const { data, isLoading } = useGetDeliveryDetail({
    params: { id: confirmId },
  });

  const { mutateAsync: confirmDelivery } = usePutConfirmDelivery();

  const onCancel = async (formData: PutConfirmDeliveryDTO) => {
    console.log("Confirm Delivery Data:", formData);
    confirmDelivery({
      deliveryId: confirmId ?? "",
      confirmationFromFactory: formData.confirmationFromSender,
      confirmationFromPartner: formData.confirmationFromSender,
      confirmationFromReceiver: formData.confirmationFromReceiver,
      driverName: data?.driverName ?? "",
      deliveryAddress: data?.deliveryAddress ?? "",
      deliveryUnitPrice: data?.deliveryUnitPrice ?? 0,
      additionalFees: data?.additionalFees ?? 0,
      deliveryOrderNote: data?.deliveryOrderNote ?? "",
      distance: data?.distance ?? 0,
    });
    onCloseHandler();
  };

  const onCloseHandler = () => {
    reset({});
    onClose();
  };

  useEffect(() => {
    if (data) {
      reset({
        deliveryId: data.id,
        confirmationFromSender:
          data.deliveryType === EDeliveryType.IMPORT
            ? data.confirmationFromFactory
            : data.confirmationFromPartner,
        confirmationFromReceiver: data.confirmationFromReceiver,
        confirmationFromFactory: data.confirmationFromFactory,
        confirmationFromPartner: data.confirmationFromPartner,
      });
    }
  }, [data]);

  const confirmationFromSender =
    data?.deliveryType === EDeliveryType.IMPORT
      ? data.confirmationFromFactory
      : data?.confirmationFromPartner;
  const confirmationFromReceiver = data?.confirmationFromReceiver;
  const confirmDeliver = confirmationFromSender === EConfirmation.PENDING;
  const confirmReceived =
    confirmationFromSender === EConfirmation.YES &&
    confirmationFromReceiver === EConfirmation.PENDING;
  return (
    <Modal isOpen={isOpen} onClose={() => onCloseHandler()}>
      <ModalHeader title="Confirm Delivery" />
      <form onSubmit={handleSubmit(onCancel)}>
        {confirmDeliver && (
          <div className="mt-2 flex w-[600px] flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold">
                Did your partner confirm delivery with ID
                <span className="text-info-500">
                  {} {data?.id} {}
                </span>
                for{" "}
                {`${
                  data?.deliveryType === EDeliveryType.IMPORT
                    ? "import order " + data.purchaseOrderId
                    : "sale order " + data?.saleOrderId
                }`}
                ?
              </span>
              <span className="text-sm">This action cannot be undone.</span>
            </div>
          </div>
        )}
        {confirmReceived && (
          <div className="mt-2 flex w-[600px] flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold">
                Did your receiver confirm delivery with ID
                <span className="text-info-500">
                  {} {data?.id} {}
                </span>
                for{" "}
                {`${
                  data?.deliveryType === EDeliveryType.IMPORT
                    ? "import order " + data.purchaseOrderId
                    : "sale order " + data?.saleOrderId
                } `}
                have been received?
              </span>
              <span className="text-sm">This action cannot be undone.</span>
            </div>
          </div>
        )}
        {!confirmDeliver && !confirmReceived && (
          <div className="mt-2 flex w-[600px] flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold">
                Delivery with ID
                <span className="text-info-500">
                  {} {data?.id} {}
                </span>
                for{" "}
                {`${
                  data?.deliveryType === EDeliveryType.IMPORT
                    ? "import order " + data.purchaseOrderId
                    : "sale order " + data?.saleOrderId
                } `}
                has already been confirmed or canceled by your partner.
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          {(confirmDeliver || confirmReceived) && (
            <>
              <Button
                size={"sm"}
                disabled={isLoading}
                value={EConfirmation.YES}
                onClick={() =>
                  setValue(
                    confirmDeliver
                      ? "confirmationFromSender"
                      : "confirmationFromReceiver",
                    EConfirmation.YES,
                  )
                }
              >
                Yes
              </Button>
              <Button
                size={"sm"}
                variant={"destructive"}
                disabled={isLoading}
                value={EConfirmation.NO}
                onClick={() =>
                  setValue(
                    confirmDeliver
                      ? "confirmationFromSender"
                      : "confirmationFromReceiver",
                    EConfirmation.NO,
                  )
                }
              >
                No
              </Button>
            </>
          )}
          <Button
            onClick={() => onClose()}
            type="button"
            size={"sm"}
            variant={"secondary"}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
