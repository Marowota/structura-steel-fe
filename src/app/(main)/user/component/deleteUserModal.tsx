import { Button, Modal, ModalHeader } from "@/components/elements";
import { useGetUserDetail } from "../api/getUsersDetail";
import { useDeleteUser } from "../api/deleteUsers";

export const UserDeleteModal = ({
  isOpen,
  onClose,
  deleteId,
  username,
}: {
  isOpen: boolean;
  onClose: () => void;
  deleteId?: string;
  username?: string;
}) => {
  const { data, isLoading } = useGetUserDetail({
    params: { username },
  });

  const { mutateAsync: deleteUser } = useDeleteUser();

  const onDelete = async () => {
    deleteUser({ userId: deleteId ?? "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalHeader title="Delete User" className="text-red-800" />
      <div className="mt-2 flex min-w-[400px] flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">
            Are you sure you want to delete user
            <span className="text-brand-800">
              {} {data?.firstName} {data?.lastName} ({data?.username})
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
