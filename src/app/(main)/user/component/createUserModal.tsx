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
import { PostUserDTO, usePostUser } from "../api/postUsers";
import { useGetUserDetail } from "../api/getUsersDetail";
import { usePutUser } from "../api/putUsers";
import { EUserRole, EUserRoleLabel } from "../api/getUsers";

export const UserCreateModal = ({
  isOpen,
  onClose,
  editId,
  username,
}: {
  isOpen: boolean;
  onClose: () => void;
  editId: undefined | string;
  username?: string;
}) => {
  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
  } = useForm<PostUserDTO>();
  const { data: editData, isLoading } = useGetUserDetail({
    params: { username: username },
  });
  const { mutateAsync: createUser, isPending: isPostingUser } = usePostUser();
  const { mutateAsync: updateUser, isPending: isPuttingUser } = usePutUser();
  const isPending = isPostingUser || isPuttingUser;

  const onCloseHandler = () => {
    reset({});
    onClose();
  };

  const onSubmit = async (data: PostUserDTO) => {
    try {
      if (editId) {
        await updateUser({
          ...data,
          userId: editId,
        });
      } else {
        await createUser(data);
      }
      onCloseHandler();
    } catch {}
  };

  useEffect(() => {
    reset(editData);
  }, [editData]);

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler} className="max-w-[600px]">
      <div className="flex flex-col gap-2">
        <ModalHeader title={`${editId ? "Edit" : "New"} User`} />
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <ModalSection title="Account Information">
            <div className="grid grid-cols-2 gap-2">
              {/* <Input
                label={!!editId ? "New Password" : "Password"}
                {...register("password", {
                  required: editId ? false : "Password is required",
                  minLength: { message: "Minimum length is 6", value: 6 },
                  maxLength: { message: "Maximum length is 100", value: 100 },
                  pattern: {
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{6,}$/,
                  },
                })}
                type="password"
                disabled={isLoading}
                required={!editId}
                isError={!!errors.password}
                errorMessage={errors.password?.message}
              /> */}
              <div className="col-span-2">
                <Input
                  label="Username"
                  {...register("username", {
                    required: "Username is required",
                    minLength: { message: "Minimum length is 3", value: 3 },
                    maxLength: { message: "Maximum length is 50", value: 50 },
                    pattern: {
                      message:
                        "Username can only contain letters, numbers, and underscores",
                      value: /^[a-zA-Z0-9_]+$/,
                    },
                  })}
                  disabled={isLoading || !!editId}
                  required
                  isError={!!errors.username}
                  errorMessage={errors.username?.message}
                />
                <Controller
                  name="realmRole"
                  control={control}
                  rules={{
                    required: "Realm Role is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Dropdown
                      label="Realm Role"
                      options={mapArrayToTDropdown(
                        Object.entries(EUserRole)
                          .filter(([, value]) => value !== EUserRole.ROLE_USER)
                          .map(([key, value]) => ({
                            label: EUserRoleLabel.get(value) ?? key,
                            value: value,
                          })),
                        "label",
                        "value",
                      )}
                      outerValue={value}
                      onItemSelect={(item) => onChange(item.value)}
                      disabled={isLoading}
                      isError={!!errors.realmRole}
                      errorMessage={errors.realmRole?.message}
                      required
                    />
                  )}
                />
              </div>
            </div>
          </ModalSection>
          <ModalSection title="Personal Information">
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="First Name"
                {...register("firstName", {
                  required: "First Name is required",
                })}
                disabled={isLoading}
                required
                isError={!!errors.firstName}
                errorMessage={errors.firstName?.message}
              />
              <Input
                label="Last Name"
                {...register("lastName", {
                  required: "Last Name is required",
                })}
                disabled={isLoading}
                required
                isError={!!errors.lastName}
                errorMessage={errors.lastName?.message}
              />
              <div className="col-span-2">
                <Input
                  label="Email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  type="email"
                  disabled={isLoading}
                  required
                  isError={!!errors.email}
                  errorMessage={errors.email?.message}
                />
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
            <Button size={"sm"} disabled={isLoading || isPending}>
              {editId ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
