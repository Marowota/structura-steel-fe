"use client";
import { createContext, JSX, ReactNode, useEffect, useState } from "react";
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
