import {
  Input,
  InputSearch,
  Modal,
  ModalHeader,
  ModalSection,
} from "@/components/elements";
import { Dropdown } from "@/components/elements/dropdown";

export const OrderCreateModal = ({
  isOpen,
  onClose,
  editId,
}: {
  isOpen: boolean;
  onClose: () => void;
  editId?: string;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="Create Order" />
      <form className="flex min-h-96 flex-row gap-4">
        <ModalSection title="General Information">
          <div className="grid min-w-72 grid-rows-3 gap-2">
            <Dropdown label="Partner" options={[]} />
            <Dropdown label="Project" options={[]} />
            <Dropdown label="Order type" options={[]} />
          </div>
        </ModalSection>
        <ModalSection title="Products">
          <InputSearch placeholder="Search" options={[]} />
          <div className="flex min-w-96 flex-col gap-2"></div>
        </ModalSection>
      </form>
    </Modal>
  );
};
