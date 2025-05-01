"use client";
import { PostLoginDTO, usePostLogin } from "@/app/login/api/postLogin";
import { Button, Input } from "@/components/elements";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

export default function LoginForm() {
  const { register, handleSubmit } = useForm<PostLoginDTO>();
  const { mutateAsync: login } = usePostLogin();
  const onSubmit: SubmitHandler<PostLoginDTO> = async (data) => {
    const response = await login(data);
    if (response) {
      const expiresIn = new Date(
        Date.now() + ((response.expires_in ?? 0) - 60) * 1000,
      );

      const refreshExpireIn = new Date(
        Date.now() + ((response.refresh_expires_in ?? 0) - 60) * 1000,
      );

      sessionStorage.setItem("access_token", response.access_token ?? "");
      sessionStorage.setItem("expires_in", expiresIn.toISOString());
      localStorage.setItem("refresh_token", response.refresh_token ?? "");
      localStorage.setItem("refresh_expires_in", refreshExpireIn.toISOString());
      redirect("/");
    }
  };

  return (
    <div className="flex h-fit w-fit flex-col items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-md">
      <Image
        src="/structura-steel-icon.png"
        alt="icon"
        width={200}
        height={200}
        className="w-60"
        draggable={false}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-[400px] min-w-[300px] flex-col gap-4 px-5 pb-5"
      >
        <Input
          className="w-full"
          placeholder="Username"
          type="text"
          variant={"normal"}
          {...register("username")}
        />
        <Input
          className="w-full"
          placeholder="Password"
          type="password"
          variant={"normal"}
          {...register("password")}
        />
        <Button className="w-full" type="submit">
          login
        </Button>
      </form>
    </div>
  );
}
