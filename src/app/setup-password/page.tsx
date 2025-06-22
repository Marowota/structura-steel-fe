"use client";

import { redirect } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Input } from "@/components/elements";
import {
  PostChangePasswordFirstTimeDTO,
  usePostChangePasswordFirstTime,
} from "./api/postChangePasswordFirstTime";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { authSlice, selectIsFirstLogin, store } from "@/lib";

export default function ChangePasswordFirstTimePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostChangePasswordFirstTimeDTO>();
  const { mutateAsync: changePassword } = usePostChangePasswordFirstTime();
  const firstLogin = useSelector(selectIsFirstLogin);
  useEffect(() => {
    if (!firstLogin) {
      redirect("/");
    }
  }, [firstLogin]);

  const onSubmit: SubmitHandler<PostChangePasswordFirstTimeDTO> = async (
    data,
  ) => {
    const response = await changePassword(data);
    if (response) {
      store.dispatch(
        authSlice.actions.setFirstLogin({
          firstLogin: false,
        }),
      );
      redirect("/login");
    }
  };

  return (
    <div className="flex h-svh w-full items-center justify-center bg-gray-200">
      <div className="flex h-fit w-fit flex-col items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-md">
        <div>Change first time password</div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-[400px] min-w-[300px] flex-col gap-4 px-5 pb-5"
        >
          <Input
            className="w-full"
            placeholder="Email"
            type="text"
            variant={"normal"}
            {...register("email", { required: "Email is required" })}
            required
            isError={!!errors.email}
            errorMessage={errors.email?.message}
          />
          <Input
            className="w-full"
            placeholder="Temporary password"
            type="password"
            variant={"normal"}
            {...register("temporaryPassword", {
              required: "Temporary password is required",
            })}
            required
            isError={!!errors.temporaryPassword}
            errorMessage={errors.temporaryPassword?.message}
          />
          <Input
            className="w-full"
            placeholder="New password"
            type="password"
            variant={"normal"}
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
          <Button className="w-full" type="submit">
            Change password
          </Button>
        </form>
      </div>
    </div>
  );
}
