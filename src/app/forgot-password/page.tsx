"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Input } from "@/components/elements";
import {
  PostForgotPasswordDTO,
  usePostForgotPassword,
} from "./api/postForgotPassword";
import { PostVerifyOtpDTO, usePostVerifyOtp } from "./api/postVerifyOtp";
import {
  PostResetPasswordDTO,
  usePostResetPassword,
} from "../(main)/user/api/postResetPassword";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot },
  } = useForm<PostForgotPasswordDTO>();

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp },
    setValue: setValueOtp,
    watch: watchOtp,
  } = useForm<PostVerifyOtpDTO>();

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset },
    setValue: setValueReset,
    watch: watchReset,
  } = useForm<PostResetPasswordDTO & { retypeNewPassword: string }>();

  const { mutateAsync: forgotPassword, isPending: isPendingForgot } =
    usePostForgotPassword();
  const { mutateAsync: verifyOtp, isPending: isPendingVerifyOtp } =
    usePostVerifyOtp();
  const { mutateAsync: resetPassword, isPending: isPendingReset } =
    usePostResetPassword();

  const requestedEmail = watchOtp("email");
  const verifiedEmail = watchReset("email");

  const onSubmitForgot: SubmitHandler<PostForgotPasswordDTO> = async (data) => {
    try {
      const result = await forgotPassword(data);
      if (result.status == "200") {
        setValueOtp("email", data.email);
      }
    } catch (error) {
      console.log("Error during forgot password:", error);
    }
  };

  const onSubmitOtp: SubmitHandler<PostVerifyOtpDTO> = async (data) => {
    try {
      const result = await verifyOtp(data);
      if (result.status == "200") {
        setValueReset("email", data.email);
      }
    } catch (error) {
      console.log("Error during forgot password:", error);
    }
  };

  const onSubmitReset = async (data: PostResetPasswordDTO) => {
    try {
      const result = await resetPassword({
        email: data.email,
        newPassword: data.newPassword,
      });
      console.log("result status", result.status);
      if (result.status == "200") {
        console.log("result status2", result.status);
        router.push("/login");
      }
    } catch {}
  };

  return (
    <div className="flex h-svh w-full items-center justify-center bg-gray-200">
      <div className="flex h-fit w-fit flex-col items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-md">
        {!requestedEmail && !verifiedEmail && (
          <>
            <div className="text-md-semibold">Forgot password</div>
            <form
              onSubmit={handleSubmitForgot(onSubmitForgot)}
              className="flex w-[400px] min-w-[300px] flex-col gap-4 px-5 pb-5"
            >
              <Input
                label="Email"
                className="w-full"
                placeholder="Email"
                type="text"
                variant={"normal"}
                {...registerForgot("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
                required
                isError={!!errorsForgot.email}
                errorMessage={errorsForgot.email?.message}
              />
              <Button
                className="w-full"
                type="submit"
                disabled={isPendingForgot}
              >
                Change password
              </Button>
            </form>
          </>
        )}
        {requestedEmail && !verifiedEmail && (
          <>
            <div className="text-md-semibold">Verify OTP</div>
            <form
              onSubmit={handleSubmitOtp(onSubmitOtp)}
              className="flex w-[400px] min-w-[300px] flex-col gap-4 px-5 pb-5"
            >
              <Input
                label="OTP"
                className="w-full"
                placeholder="OTP"
                type="text"
                variant={"normal"}
                {...registerOtp("otp", {
                  required: "OTP is required",
                })}
                required
                isError={!!errorsOtp.otp}
                errorMessage={errorsOtp.otp?.message}
              />
              <Button
                className="w-full"
                type="submit"
                disabled={isPendingVerifyOtp || isPendingForgot}
              >
                Verify
              </Button>
              <Button
                className="self-end"
                type="button"
                variant={"tertiary"}
                size={"sm"}
                onClick={() => {
                  console.log("Resend OTP clicked");
                  onSubmitForgot({
                    email: requestedEmail,
                  });
                }}
                disabled={isPendingForgot}
              >
                Resend OTP
              </Button>
            </form>
          </>
        )}
        {verifiedEmail && (
          <>
            <div className="text-md-semibold">Reset Password</div>
            <form
              onSubmit={handleSubmitReset(onSubmitReset)}
              className="flex w-[400px] min-w-[300px] flex-col gap-4 px-5 pb-5"
            >
              <Input
                label="New Password"
                type="password"
                {...registerReset("newPassword", {
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
                isError={!!errorsReset.newPassword}
                errorMessage={errorsReset.newPassword?.message}
              />
              <Input
                label="Retype New Password"
                type="password"
                {...registerReset("retypeNewPassword", {
                  required: "Password is required",
                  validate: (value) =>
                    value === watchReset("newPassword") ||
                    "Password does not match",
                })}
                required
                isError={!!errorsReset.retypeNewPassword}
                errorMessage={errorsReset.retypeNewPassword?.message}
              />
              <Button
                className="w-full"
                type="submit"
                disabled={isPendingReset}
              >
                Reset Password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
