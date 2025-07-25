"use client";
import { PostLoginDTO, usePostLogin } from "@/app/login/api/postLogin";
import { Button, Input } from "@/components/elements";
import { setCredential } from "@/hooks/useGetUserInfo";
import { selectIsAuthenticated, selectIsFirstLogin } from "@/lib/reducers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function LoginForm() {
  const { register, handleSubmit } = useForm<PostLoginDTO>();
  const { mutateAsync: login } = usePostLogin();
  const dispatch = useDispatch();

  const authenticated = useSelector(selectIsAuthenticated);
  const isFirstLogin = useSelector(selectIsFirstLogin);

  useEffect(() => {
    if (authenticated) {
      redirect("/");
    }
  }, [authenticated]);

  useEffect(() => {
    if (isFirstLogin) {
      redirect("/setup-password");
    }
  }, [isFirstLogin]);

  const onSubmit: SubmitHandler<PostLoginDTO> = async (data) => {
    const response = await login(data);
    if (response) {
      setCredential(response, dispatch);
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
        <Link
          href="/forgot-password"
          className="self-end text-sm text-blue-500 hover:text-blue-800"
        >
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
