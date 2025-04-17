"use client";
import { Button, Input } from "@/components/elements";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";

type TLogin = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const { register, handleSubmit } = useForm<TLogin>();
  const onSubmit: SubmitHandler<TLogin> = (data) => {
    console.log(data);
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
