import { Modal, ModalHeader, ModalSection } from "@/components/elements";
import { useGetProjectDetailByPartner } from "../../api/getProjectsDetailByPartner";

export const ProjectDetailModal = ({
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
  const { data } = useGetProjectDetailByPartner({
    params: { partnerId, projectId: id },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="Project detail"></ModalHeader>
      <div className="mt-2 flex min-w-[400px] flex-col gap-4">
        <ModalSection title="Project Information">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Name:</span>
              <span className="text-sm">{data?.projectName ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Code:</span>
              <span className="text-sm">{data?.projectCode ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Address:</span>
              <span className="text-sm">{data?.projectAddress ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Representative:</span>
              <span className="text-sm">
                {data?.projectRepresentative ?? "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Representative Phone:</span>
              <span className="text-sm">
                {data?.projectRepresentativePhone ?? "-"}
              </span>
            </div>
          </div>
        </ModalSection>
        <ModalSection title="Contact Information">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Contact Person:</span>
              <span className="text-sm">{data?.contactPerson ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Phone Number:</span>
              <span className="text-sm">{data?.contactPersonPhone ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Address:</span>
              <span className="text-sm">{data?.address ?? "-"}</span>
            </div>
          </div>
        </ModalSection>
      </div>
    </Modal>
  );
};
