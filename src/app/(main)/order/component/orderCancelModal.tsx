import { Button, Modal, ModalHeader, Textarea } from "@/components/elements";
import { useGetOrderDetail } from "../api/getOrdersDetails";
import { PutCancelOrderDTO, usePutCancelOrder } from "../api/putCancelOrder";
import { useForm } from "react-hook-form";

export const OrderCancelModal = ({
  isOpen,
  onClose,
  cancelId,
}: {
  isOpen: boolean;
  onClose: () => void;
  cancelId?: string;
}) => {
  const { register, handleSubmit, reset } = useForm<PutCancelOrderDTO>({
    defaultValues: { reason: "", orderId: cancelId ?? "" },
  });

  const { data, isLoading } = useGetOrderDetail({
    params: { id: cancelId },
  });

  const { mutateAsync: cancelOrder } = usePutCancelOrder();

  const onCancel = async (data: PutCancelOrderDTO) => {
    cancelOrder({
      orderId: cancelId ?? "",
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
      <ModalHeader title="Cancel Order" className="text-red-800" />
      <form onSubmit={handleSubmit(onCancel)}>
        <div className="mt-2 flex w-[600px] flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold">
              Are you sure you want to cancel order with ID
              <span className="text-error-800">
                {} {data?.id} {}
              </span>
              by
              <span className="text-brand-800">
                {} ({data?.partner?.partnerName} - {data?.project?.projectName}){" "}
                {}
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
            Close
          </Button>
          <Button size={"sm"} variant={"destructive"} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
