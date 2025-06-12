import { Button, Modal, ModalHeader } from "@/components/elements";
import { useForm } from "react-hook-form";
import {
  EConfirmationFromSupplier,
  PutConfirmImportDTO,
  usePutConfirmImport,
} from "../api/putConfirmImport";
import { useGetImportDetail } from "../api/getImportsDetails";

export const ImportConfirmModal = ({
  isOpen,
  onClose,
  confirmId,
}: {
  isOpen: boolean;
  onClose: () => void;
  confirmId?: string;
}) => {
  const { data, isLoading } = useGetImportDetail({
    params: { id: confirmId },
  });

  const { setValue, handleSubmit, reset } = useForm<PutConfirmImportDTO>({
    defaultValues: {
      importId: confirmId ?? "",
      confirmationFromSupplier: EConfirmationFromSupplier.NO,
    },
  });

  const { mutateAsync: confirmImport } = usePutConfirmImport();

  const onCancel = async (formData: PutConfirmImportDTO) => {
    confirmImport({
      importId: confirmId ?? "",
      confirmationFromSupplier: formData.confirmationFromSupplier,
      purchaseOrdersNote: data?.purchaseOrdersNote,
    });
    onCloseHandler();
  };

  const onCloseHandler = () => {
    reset({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onCloseHandler()}>
      <ModalHeader title="Confirm Import" />
      <form onSubmit={handleSubmit(onCancel)}>
        <div className="mt-2 flex w-[600px] flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold">
              Did your partner confirm import with ID
              <span className="text-info-500">
                {} {data?.id} {}
              </span>
              from supplier
              <span className="text-info-500">
                {} ({data?.supplier?.partnerName})
              </span>{" "}
              to project{" "}
              <span className="text-info-500">
                {data?.project?.projectName} {}
              </span>
              ?
            </span>

            <span className="text-sm">This action cannot be undone.</span>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            size={"sm"}
            disabled={isLoading}
            value={EConfirmationFromSupplier.YES}
            onClick={() =>
              setValue(
                "confirmationFromSupplier",
                EConfirmationFromSupplier.YES,
              )
            }
          >
            Yes
          </Button>
          <Button
            size={"sm"}
            variant={"destructive"}
            disabled={isLoading}
            value={EConfirmationFromSupplier.NO}
            onClick={() =>
              setValue("confirmationFromSupplier", EConfirmationFromSupplier.NO)
            }
          >
            No
          </Button>
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
