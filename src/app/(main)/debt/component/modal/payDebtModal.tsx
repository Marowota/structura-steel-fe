import { Button, Dropdown, Input } from "@/components/elements";
import { Modal } from "@/components/elements/modal";
import { ModalHeader } from "@/components/elements/modalHeader";
import { ModalSection } from "@/components/elements/modalSection";
import { Controller, useForm } from "react-hook-form";
import {
  EDebtType,
  PostPayDebtDTO,
  usePostPayDebt,
} from "../../api/postPayDebt";
import { useEffect } from "react";

export const PayDebtModal = ({
  isOpen,
  onClose,
  editId,
  debtType,
}: {
  isOpen: boolean;
  onClose: () => void;
  editId?: string;
  debtType: EDebtType;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<PostPayDebtDTO>();
  const { mutateAsync: createProduct } = usePostPayDebt();

  const onCloseHandler = () => {
    reset({});
    onClose();
  };

  const onSubmit = async (data: PostPayDebtDTO) => {
    try {
      await createProduct({
        ...data,
        paymentDate: new Date(data.paymentDate).toISOString(),
      });
      onCloseHandler();
    } catch {}
  };

  useEffect(() => {
    reset({
      debtType: debtType,
      debtId: editId ?? "",
      paymentDate: new Date().toISOString(),
      amountPaid: "",
      paymentMethod: "VISA", // Default payment method
      notes: "",
    });
  }, [editId, debtType]);

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler}>
      <div className="flex flex-col gap-2">
        <ModalHeader title={`Pay debt`} />
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <ModalSection title="Debt Information">
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Debt Type"
                {...register("debtType", { required: "Debt type is required" })}
                isError={!!errors.debtType}
                errorMessage={errors.debtType?.message}
                disabled
                required
              />
              <Input
                label="Debt ID"
                {...register("debtId", { required: "Debt ID is required" })}
                isError={!!errors.debtId}
                errorMessage={errors.debtId?.message}
                disabled
                required
              />
              <Input
                label="Payment Date"
                type="date"
                {...register("paymentDate", {
                  required: "Payment Date is required",
                })}
                isError={!!errors.paymentDate}
                errorMessage={errors.paymentDate?.message}
                required
              />
              <Input
                label="Amount Paid"
                type="number"
                {...register("amountPaid", {
                  required: "Amount paid is required",
                  min: {
                    value: 0,
                    message: "Amount Paid cannot be negative",
                  },
                })}
                isError={!!errors.amountPaid}
                errorMessage={errors.amountPaid?.message}
                required
              />
              <Controller
                control={control}
                name="paymentMethod"
                rules={{ required: "Payment Method is required" }}
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    label="Payment Method"
                    options={[
                      { value: "VISA", selectionLabel: "VISA", label: "VISA" },
                      { value: "CASH", selectionLabel: "CASH", label: "CASH" },
                    ]}
                    {...register("paymentMethod", { required: true })}
                    outerValue={value}
                    onItemSelect={(item) => {
                      onChange(item.value);
                    }}
                    errorMessage={
                      errors.paymentMethod
                        ? "Payment method is required"
                        : undefined
                    }
                    required
                  />
                )}
              />
              <Input label="Notes" {...register("notes")} />
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
            <Button size={"sm"}>{"Pay"}</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
