import {
  Button,
  Dropdown,
  Input,
  mapArrayToTDropdown,
  Textarea,
} from "@/components/elements";
import { Modal } from "@/components/elements/modal";
import { ModalHeader } from "@/components/elements/modalHeader";
import { ModalSection } from "@/components/elements/modalSection";
import { Controller, useForm } from "react-hook-form";
import { PostVehicleDTO, usePostVehicle } from "../../api/postVehicles";
import { useEffect } from "react";
import { useGetVehicleDetailByPartner } from "../../api/getVehiclesDetailByPartner";
import { usePutVehicle } from "../../api/putVehicles";
import {
  EVehicleType,
  EVehicleTypeLabel,
} from "../../api/getVehiclesByPartner";

export const VehicleCreateModal = ({
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
  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
  } = useForm<PostVehicleDTO>({
    defaultValues: { partnerId },
  });
  const { data: editData, isLoading } = useGetVehicleDetailByPartner({
    params: { partnerId: partnerId, vehicleId: editId },
  });
  const { mutateAsync: createVehicle } = usePostVehicle();
  const { mutateAsync: updateVehicle } = usePutVehicle();

  const onCloseHandler = () => {
    reset({});
    onClose();
  };

  const onSubmit = async (data: PostVehicleDTO) => {
    try {
      if (editId) {
        await updateVehicle({
          ...data,
          vehicleId: editId,
          partnerId: partnerId,
        });
      } else {
        await createVehicle({ ...data, partnerId: partnerId });
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
        <ModalHeader title={`${editId ? "Edit" : "New"} Vehicle`} />
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <ModalSection title="Vehicle Information">
            <div className="grid grid-cols-2 gap-2">
              <Input label="Driver Name" {...register("driverName")} />
              <Input label="License Plate" {...register("licensePlate")} />

              <Controller
                control={control}
                name="vehicleType"
                rules={{ required: "Vehicle type is required" }}
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="Vehicle Type"
                    options={mapArrayToTDropdown(
                      Object.entries(EVehicleType).map(([, value]) => ({
                        label: EVehicleTypeLabel.get(value),
                        value: value,
                      })),
                      "label",
                      "value",
                    )}
                    outerValue={value}
                    onItemSelect={(item) => onChange(item.value)}
                    required
                    isError={errors.vehicleType ? true : false}
                    errorMessage={errors.vehicleType?.message}
                  />
                )}
              />
              <Input
                type="number"
                label="Capacity"
                {...register("capacity", {
                  min: {
                    value: 0,
                    message: "Capacity cannot be negative",
                  },
                })}
              />
              <div className="col-span-2">
                <Textarea label="Description" {...register("description")} />
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
