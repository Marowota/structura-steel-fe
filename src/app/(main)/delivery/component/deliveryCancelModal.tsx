import { Button, Modal, ModalHeader, Textarea } from "@/components/elements";
import { useGetDeliveryDetail } from "../api/getDeliveriesDetails";
import {
  PutCancelDeliveryDTO,
  usePutCancelDelivery,
} from "../api/putCancelDelivery";
import { useForm } from "react-hook-form";

export const DeliveryCancelModal = ({
  isOpen,
  onClose,
  cancelId,
}: {
  isOpen: boolean;
  onClose: () => void;
  cancelId?: string;
}) => {
  const { register, handleSubmit, reset } = useForm<PutCancelDeliveryDTO>({
    defaultValues: { reason: "", deliveryId: cancelId ?? "" },
  });

  const { data, isLoading } = useGetDeliveryDetail({
    params: { id: cancelId },
  });

  const { mutateAsync: cancelDelivery } = usePutCancelDelivery();

  const onCancel = async (data: PutCancelDeliveryDTO) => {
    cancelDelivery({
      deliveryId: cancelId ?? "",
      reason: data.reason,
    });
    onCloseHandler();
  };

  const onCloseHandler = () => {
    reset({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onCloseHandler()}>
      <ModalHeader title="Cancel Delivery" className="text-red-800" />
      <form onSubmit={handleSubmit(onCancel)}>
        <div className="mt-2 flex w-[600px] flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold">
              Are you sure you want to cancel delivery with ID
              <span className="text-error-800">
                {} {data?.id} {}
              </span>
              by
              <span className="text-brand-800">
                {} ({data?.partner?.partnerName} - {data?.partner?.bankName}) {}
              </span>{" "}
              ?
            </span>

            <Textarea label="Reason" {...register("reason")} />

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
          <Button size={"sm"} variant={"destructive"} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
