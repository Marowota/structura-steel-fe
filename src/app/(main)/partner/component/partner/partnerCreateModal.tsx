import {
  Button,
  Dropdown,
  Input,
  mapArrayToTDropdown,
} from "@/components/elements";
import { Modal } from "@/components/elements/modal";
import { ModalHeader } from "@/components/elements/modalHeader";
import { ModalSection } from "@/components/elements/modalSection";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useGetPartnerDetail } from "../../api/getPartnersDetail";
import { PostPartnerDTO, usePostPartner } from "../../api/postPartner";
import { usePutPartner } from "../../api/putPartner";
import { EPartnerType, EPartnerTypeLabel } from "../../api/getPartners";

export const PartnerCreateModal = ({
  isOpen,
  onClose,
  editId,
}: {
  isOpen: boolean;
  onClose: () => void;
  editId: undefined | string;
}) => {
  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
  } = useForm<PostPartnerDTO>();
  const { data: editData, isLoading } = useGetPartnerDetail({
    params: { id: editId },
  });
  const { mutateAsync: createPartner } = usePostPartner();
  const { mutateAsync: updatePartner } = usePutPartner();

  const onCloseHandler = () => {
    reset({});
    onClose();
  };

  const onSubmit = async (data: PostPartnerDTO) => {
    try {
      if (editId) {
        await updatePartner({
          ...data,
          partnerId: editId,
        });
      } else {
        await createPartner(data);
      }
      onCloseHandler();
    } catch {}
  };

  useEffect(() => {
    reset(editData);
  }, [editData]);

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler} className="max-w-[800px]">
      <div className="flex flex-col gap-2">
        <ModalHeader title={`${editId ? "Edit" : "New"} Partner`} />
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <ModalSection title="Partner Information">
              <div className="grid gap-2">
                <Input
                  label="Partner Name"
                  {...register("partnerName", {
                    required: "Partner name is required",
                  })}
                  required
                  disabled={isLoading}
                  isError={!!errors.partnerName}
                  errorMessage={errors.partnerName?.message}
                />
                <Controller
                  control={control}
                  name="partnerType"
                  rules={{ required: "Partner type is required" }}
                  render={({ field: { onChange, value } }) => (
                    <Dropdown
                      label="Partner type"
                      options={mapArrayToTDropdown(
                        Object.entries(EPartnerType)
                          .filter(([, value]) => value !== EPartnerType.UNKNOWN)
                          .map(([, value]) => ({
                            label: EPartnerTypeLabel.get(value),
                            value: value,
                          })),
                        "label",
                        "value",
                      )}
                      onItemSelect={(item) => {
                        onChange(item.value);
                      }}
                      required
                      isError={errors.partnerType ? true : false}
                      errorMessage={errors.partnerType?.message}
                      outerValue={value}
                    />
                  )}
                />
              </div>
            </ModalSection>
            <ModalSection title="Banking Information">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <Input
                    label="Bank Name"
                    {...register("bankName")}
                    disabled={isLoading}
                  />
                </div>
                <Input
                  label="Bank Account Number"
                  {...register("bankAccountNumber")}
                  disabled={isLoading}
                />
                <Input
                  label="Tax Code"
                  {...register("taxCode", {
                    required: "Tax code is required",
                  })}
                  required
                  disabled={isLoading}
                  isError={!!errors.taxCode}
                  errorMessage={errors.taxCode?.message}
                />
              </div>
            </ModalSection>
          </div>

          <ModalSection title="Contact Information">
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Legal Representative"
                {...register("legalRepresentative")}
                disabled={isLoading}
              />
              <Input
                type="number"
                label="Legal Representative Phone"
                required
                {...register("legalRepresentativePhone", {
                  pattern: {
                    value: /^(0|\+84)(\d{9})$/,
                    message: "Invalid phone number",
                  },
                  required: "Legal representative phone is required",
                })}
                disabled={isLoading}
                isError={!!errors.legalRepresentativePhone}
                errorMessage={errors.legalRepresentativePhone?.message}
              />
              <Input
                label="Contact Person"
                {...register("contactPerson")}
                disabled={isLoading}
              />
              <Input
                type="number"
                label="Contact Person Phone"
                required
                {...register("contactPersonPhone", {
                  pattern: {
                    value: /^(0|\+84)(\d{9})$/,
                    message: "Invalid phone number",
                  },
                  required: "Contact person phone is required",
                })}
                disabled={isLoading}
                isError={!!errors.contactPersonPhone}
                errorMessage={errors.contactPersonPhone?.message}
              />
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
