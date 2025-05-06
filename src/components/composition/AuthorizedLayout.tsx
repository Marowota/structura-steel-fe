"use client";
import { createContext, JSX, ReactNode, useEffect, useState } from "react";
import { TJwtObject } from "@/types/TJwtObject";
import { useAuthenticate } from "@/hooks/useGetUserInfo";
import { selectUserInfo } from "@/lib/reducers";
import { store } from "@/lib/store";

export const UserContext = createContext<TJwtObject | null | undefined>(null);

export function AuthorizedLayout({ children }: { children?: ReactNode }) {
  const userInfo = selectUserInfo(store.getState());

  return (
    <>
      <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
    </>
  );
}
