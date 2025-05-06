"use client";
import { createContext, ReactNode } from "react";
import { TJwtObject } from "@/types/TJwtObject";
import { selectUserInfo, store } from "@/lib";

export const UserContext = createContext<TJwtObject | null | undefined>(null);

export function AuthorizedLayout({ children }: { children?: ReactNode }) {
  const userInfo = selectUserInfo(store.getState());

  return (
    <>
      <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
    </>
  );
}
