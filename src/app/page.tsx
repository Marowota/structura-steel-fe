"use client";
import { selectUserInfo } from "@/lib";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { useGetMyProfile } from "./(main)/account/api/getMyProfile";
import { roleHomePage } from "@/constant/roleHomePage";
import { EUserRole } from "./(main)/user/api/getUsers";
import Image from "next/image";
import { useEffect } from "react";
import { useAuthenticate } from "@/hooks/useGetUserInfo";

export default function Home() {
  useAuthenticate();
  const userInfo = useSelector(selectUserInfo);
  const { data: userDetail } = useGetMyProfile({
    params: { username: userInfo?.preferred_username },
  });
  const homePage = roleHomePage[userDetail?.realmRole ?? EUserRole.ROLE_USER];
  console.log("userInfo", userInfo);
  console.log("userDetail", userDetail);
  console.log("homePage", homePage);
  useEffect(() => {
    if (userDetail?.realmRole && homePage) {
      redirect(homePage);
    }
  }, [userDetail?.realmRole, homePage]);
  return (
    <>
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <Image
          src="/structura-steel-icon.png"
          alt="icon"
          width={200}
          height={200}
          className="w-60"
          draggable={false}
        />
      </div>
    </>
  );
}
