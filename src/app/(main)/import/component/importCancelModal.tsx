import { Button, Modal, ModalHeader, Textarea } from "@/components/elements";
import { useGetImportDetail } from "../api/getImportsDetails";
import { useForm } from "react-hook-form";
import { PutCancelImportDTO, usePutCancelImport } from "../api/putCancelImport";

export const ImportCancelModal = ({
  isOpen,
  onClose,
  cancelId,
}: {
  isOpen: boolean;
  onClose: () => void;
  cancelId?: string;
}) => {
  const { register, handleSubmit, reset } = useForm<PutCancelImportDTO>({
    defaultValues: { reason: "", importId: cancelId ?? "" },
  });

  const { data, isLoading } = useGetImportDetail({
    params: { id: cancelId },
  });

  const { mutateAsync: cancelImport } = usePutCancelImport();

  const onCancel = async (data: PutCancelImportDTO) => {
    cancelImport({
      importId: cancelId ?? "",
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
      <ModalHeader title="Cancel Import" className="text-red-800" />
      <form onSubmit={handleSubmit(onCancel)}>
        <div className="mt-2 flex w-[600px] flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold">
              Are you sure you want to cancel import with ID
              <span className="text-error-800">
                {} {data?.id} {}
              </span>
              from
              <span className="text-brand-800">
                {} ({data?.supplier?.partnerName} to{" "}
                {data?.project?.projectName}) {}
              </span>
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
