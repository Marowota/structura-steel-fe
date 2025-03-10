"use client";
import { Button, Input } from "@/components/Elements";
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
        className="h-full w-full"
        draggable={false}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-72 flex-col gap-4 px-5 pb-5"
      >
        <Input placeholder="Username" type="text" {...register("username")} />
        <Input
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        <Button type="submit">login</Button>
      </form>
    </div>
  );
}
