import { TCredential } from "@/app/login/api/postLogin";
import { usePostRefreshToken } from "@/app/login/api/postRefreshToken";
import {
  authSlice,
  selectIsAuthenticated,
  selectIsTokenExpired,
} from "@/lib/reducers";
import { store } from "@/lib/store";
import { EToastType, toastNotification } from "@/lib/toastNotification";
import { TAuthToken } from "@/types/TAuthToken";
import { TJwtObject } from "@/types/TJwtObject";
import { jwtDecode } from "jwt-decode";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const setCredential = (credential: TCredential) => {
  const expiresIn = new Date(
    Date.now() + ((credential.expires_in ?? 0) - 60) * 1000,
  );

  const refreshExpireIn = new Date(
    Date.now() + ((credential.refresh_expires_in ?? 0) - 60) * 1000,
  );

  sessionStorage.setItem("access_token", credential.access_token ?? "");
  sessionStorage.setItem("expires_in", expiresIn.toISOString());
  localStorage.setItem("refresh_token", credential.refresh_token ?? "");
  localStorage.setItem("refresh_expires_in", refreshExpireIn.toISOString());

  const authToken: TAuthToken = {
    accessToken: credential.access_token ?? "",
    refreshToken: credential.refresh_token ?? "",
    expiresIn: expiresIn.toISOString(),
    refreshExpiresIn: refreshExpireIn.toISOString(),
  };

  if (authToken.accessToken) {
    store.dispatch(
      authSlice.actions.authenticate({
        userInfo: jwtDecode<TJwtObject>(authToken.accessToken),
        authToken: authToken,
      }),
    );
  } else {
    toastNotification(
      "Logged in failed, no access token found",
      EToastType.ERROR,
    );
    store.dispatch(authSlice.actions.logout());
  }
};

export const useAuthenticate = () => {
  const { mutateAsync: getAccessToken } = usePostRefreshToken();
  const pathname = usePathname();
  const authenticated = useSelector(selectIsAuthenticated);
  const isTokenExpired = useSelector(selectIsTokenExpired);

  useEffect(() => {
    if (!isTokenExpired) return;
    console.log("b", authenticated, pathname, isTokenExpired);
    const refreshToken = localStorage.getItem("refresh_token") ?? "";
    const refreshExpiresIn = localStorage.getItem("refresh_expires_in") ?? "";

    const getCredentialHandler = async ({
      refreshToken,
    }: {
      refreshToken?: string;
    }) => {
      const response = await getAccessToken({
        grant_type: "refresh_token",
        client_id: "structura-steel-client",
        refresh_token: refreshToken ?? "",
      });

      if (response) {
        setCredential(response);
        return true;
      }
      return false;
    };

    if (
      authenticated &&
      refreshToken &&
      refreshExpiresIn &&
      refreshExpiresIn > new Date().toISOString()
    ) {
      getCredentialHandler({ refreshToken }).then((result) => {
        if (!result) {
          toastNotification("Session expired, please login again");
          store.dispatch(authSlice.actions.logout());
          redirect("/login");
        }
      });
    } else {
      toastNotification("Session expired, please login again");
      store.dispatch(authSlice.actions.logout());
      redirect("/login");
    }
  }, [isTokenExpired, getAccessToken]);

  useEffect(() => {
    console.log("a", authenticated, pathname, isTokenExpired);
    const accessToken = sessionStorage.getItem("access_token") ?? "";
    const expiresIn = sessionStorage.getItem("expires_in") ?? "";

    if (
      authenticated &&
      (!accessToken || !expiresIn || expiresIn < new Date().toISOString())
    ) {
      store.dispatch(authSlice.actions.expireToken());
    }
  }, [pathname, authenticated]);

  return { setCredential };
};
