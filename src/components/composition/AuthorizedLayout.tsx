"use client";
import { usePostRefreshToken } from "@/app/login/api/postRefreshToken";
import { toastNotification } from "@/lib/toastNotification";
import { redirect, usePathname } from "next/navigation";
import { createContext, JSX, ReactNode, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { TJwtObject } from "@/types/TJwtObject";
import { useGetUserInfo } from "@/hooks/useGetUserInfo";

export const UserContext = createContext<TJwtObject | null | undefined>(null);

export function AuthorizedLayout({ children }: { children?: ReactNode }) {
  const { userInfo } = useGetUserInfo();

  return (
    <>
      <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
    </>
  );
}
