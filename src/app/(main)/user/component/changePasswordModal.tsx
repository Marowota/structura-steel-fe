import { Button, Input } from "@/components/elements";
import { Modal } from "@/components/elements/modal";
import { ModalHeader } from "@/components/elements/modalHeader";
import { ModalSection } from "@/components/elements/modalSection";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  PostResetPasswordDTO,
  usePostResetPassword,
} from "../api/postResetPassword";

export const ChangePasswordModal = ({
  isOpen,
  onClose,
  email,
}: {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}) => {
  const {
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors },
  } = useForm<PostResetPasswordDTO & { retypeNewPassword: string }>();

  const { mutateAsync: resetPassword, isPending } = usePostResetPassword();

  const onCloseHandler = () => {
    reset({});
    onClose();
  };

  const onSubmit = async (data: PostResetPasswordDTO) => {
    try {
      await resetPassword({
        email: email,
        newPassword: data.newPassword,
      });
      onCloseHandler();
    } catch {}
  };

  useEffect(() => {
    reset({
      email: email,
      newPassword: "",
    });
  }, [email]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseHandler}
      className="w-96 max-w-[600px]"
    >
      <div className="flex flex-col gap-2">
        <ModalHeader title={`Change Password`} />
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <ModalSection title="Password Information">
            <Input
              label="New Password"
              type="password"
              {...register("newPassword", {
                required: "Password is required",
                minLength: { message: "Minimum length is 6", value: 6 },
                maxLength: { message: "Maximum length is 100", value: 100 },
                pattern: {
                  message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{6,}$/,
                },
              })}
              required
              isError={!!errors.newPassword}
              errorMessage={errors.newPassword?.message}
            />
            <Input
              label="Retype New Password"
              placeholder="Retype new password"
              type="password"
              {...register("retypeNewPassword", {
                required: "Password is required",
                validate: (value) =>
                  value === watch("newPassword") || "Password does not match",
              })}
              required
              isError={!!errors.retypeNewPassword}
              errorMessage={errors.retypeNewPassword?.message}
            />
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
            <Button size={"sm"} disabled={isPending}>
              {"Change Password"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
