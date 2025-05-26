import { Button, Input } from "@/components/elements";
import { Modal } from "@/components/elements/modal";
import { ModalHeader } from "@/components/elements/modalHeader";
import { ModalSection } from "@/components/elements/modalSection";
import { useForm } from "react-hook-form";
import { PostProjectDTO, usePostProject } from "../../api/postProjects";
import { useEffect } from "react";
import { useGetProjectDetailByPartner } from "../../api/getProjectsDetailByPartner";
import { usePutProject } from "../../api/putProjects";

export const ProjectCreateModal = ({
  isOpen,
  onClose,
  editId,
  partnerId,
}: {
  isOpen: boolean;
  onClose: () => void;
  editId: undefined | string;
  partnerId: string;
}) => {
  const { handleSubmit, reset, register } = useForm<PostProjectDTO>({
    defaultValues: { partnerId },
  });
  const { data: editData, isLoading } = useGetProjectDetailByPartner({
    params: { partnerId: partnerId, projectId: editId },
  });
  const { mutateAsync: createProject } = usePostProject();
  const { mutateAsync: updateProject } = usePutProject();

  const onCloseHandler = () => {
    reset({});
    onClose();
  };

  const onSubmit = async (data: PostProjectDTO) => {
    try {
      if (editId) {
        await updateProject({
          ...data,
          projectId: editId,
          partnerId: partnerId,
        });
      } else {
        await createProject(data);
      }
      onCloseHandler();
    } catch {}
  };

  useEffect(() => {
    reset(editData);
  }, [editData]);

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler}>
      <div className="flex flex-col gap-2">
        <ModalHeader title={`${editId ? "Edit" : "New"} Project`} />
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <ModalSection title="Project Information">
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <Input label="Name" {...register("projectName")} />
              </div>
              <div className="col-span-2">
                <Input
                  label="Address"
                  className="col-span-2"
                  {...register("projectAddress")}
                />
              </div>
              <Input
                label="Representative"
                {...register("projectRepresentative")}
              />
              <Input
                label="Representative phone"
                {...register("projectRepresentativePhone")}
              />
            </div>
          </ModalSection>

          <ModalSection title="Contact Information">
            <div className="grid grid-cols-2 gap-2">
              <Input label="Contact Person" {...register("contactPerson")} />
              <Input label="Phone number" {...register("contactPersonPhone")} />
              <div className="col-span-2">
                <Input label="Address" {...register("address")} />
              </div>
            </div>
          </ModalSection>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => onCloseHandler()}
              type="button"
              size={"sm"}
              variant={"secondary"}
            >
              Cancel
            </Button>
            <Button size={"sm"} disabled={isLoading}>
              {editId ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
