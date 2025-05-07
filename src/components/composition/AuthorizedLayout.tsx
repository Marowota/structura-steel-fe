"use client";
import { createContext, ReactNode } from "react";
import { TJwtObject } from "@/types/TJwtObject";
import { selectUserInfo } from "@/lib";
import { useAuthenticate } from "@/hooks/useGetUserInfo";
import { useSelector } from "react-redux";

export const UserContext = createContext<TJwtObject | null | undefined>(null);

export function AuthorizedLayout({ children }: { children?: ReactNode }) {
  const userInfo = useSelector(selectUserInfo);
  useAuthenticate();

  return (
    <>
      <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
    </>
  );
}
