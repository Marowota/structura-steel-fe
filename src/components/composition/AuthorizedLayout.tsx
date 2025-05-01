"use client";
import { usePostRefreshToken } from "@/app/login/api/postRefreshToken";
import { toastNotification } from "@/lib/toastNotification";
import { redirect } from "next/navigation";
import { createContext, JSX, ReactNode, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { TJwtObject } from "@/types/TJwtObject";

export const UserContext = createContext<TJwtObject | null | undefined>(null);

export function AuthorizedLayout({ children }: { children?: ReactNode }) {
  const { mutateAsync: getAccessToken } = usePostRefreshToken();
  const [userInfo, setUserInfo] = useState<TJwtObject | null>();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
    const expiresIn = sessionStorage.getItem("expires_in");
    const refreshToken = localStorage.getItem("refresh_token");
    const refreshExpiresIn = localStorage.getItem("refresh_expires_in");

    console.log("accessToken", accessToken);
    console.log("expiresIn", expiresIn);
    console.log("refreshToken", refreshToken);
    console.log("refreshExpiresIn", refreshExpiresIn);

    const getAccessTokenHandler = async () => {
      const response = await getAccessToken({
        grant_type: "refresh_token",
        client_id: "structura-steel-client",
        refresh_token: refreshToken ?? "",
      });

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
        localStorage.setItem(
          "refresh_expires_in",
          refreshExpireIn.toISOString(),
        );

        console.log("Session refreshed successfully");
        console.log("access_token", response.access_token);
        console.log("expires_in", expiresIn.toISOString());
        console.log("refresh_token", response.refresh_token);
        console.log("refresh_expires_in", refreshExpireIn.toISOString());

        return true;
      }
      return false;
    };

    if (!accessToken || !expiresIn || expiresIn < new Date().toISOString()) {
      if (
        refreshToken &&
        refreshExpiresIn &&
        refreshExpiresIn > new Date().toISOString()
      ) {
        getAccessTokenHandler().then((result) => {
          if (!result) {
            toastNotification("Session expired, please login again");
            redirect("/login");
          }
        });
      } else {
        toastNotification("Session expired, please login again");
        redirect("/login");
      }
    }

    if (accessToken) {
      setUserInfo(jwtDecode<TJwtObject>(accessToken));
    } else {
      setUserInfo(null);
    }
  }, []);

  return (
    <>
      <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
    </>
  );
}
