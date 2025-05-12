import { Button, Modal, ModalHeader } from "@/components/elements";
import { useGetProductDetail } from "../api/getProductsDetail";
import { useDeleteProduct } from "../api/deleteProduct";

export const ProductDeleteModal = ({
  isOpen,
  onClose,
  deleteId,
}: {
  isOpen: boolean;
  onClose: () => void;
  deleteId?: string;
}) => {
  const { data, isLoading } = useGetProductDetail({
    params: { id: deleteId },
  });

  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const onDelete = async () => {
    deleteProduct(deleteId ?? "");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalHeader title="Delete Product" className="text-red-800" />
      <div className="mt-2 flex min-w-[400px] flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">
            Are you sure you want to delete product
            <span className="text-brand-800">
              {} {data?.name} ({data?.code})
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
