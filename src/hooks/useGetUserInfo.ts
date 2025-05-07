import { TCredential } from "@/app/login/api/postLogin";
import { usePostRefreshToken } from "@/app/login/api/postRefreshToken";
import { authSlice, selectIsAuthenticated } from "@/lib/reducers";
import { store } from "@/lib/store";
import { EToastType, toastNotification } from "@/lib/toastNotification";
import { TAuthToken } from "@/types/TAuthToken";
import { TJwtObject } from "@/types/TJwtObject";
import { jwtDecode } from "jwt-decode";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export const useAuthenticate = ({
  noRedirect = false,
}: {
  noRedirect?: boolean;
} = {}) => {
  const { mutateAsync: getAccessToken } = usePostRefreshToken();
  const pathname = usePathname();
  const authenticated = selectIsAuthenticated(store.getState());

  const setCredential = (credential: TCredential) => {
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

    console.log(authToken);
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

  console.log("useAuthenticate", authenticated, pathname);

  useEffect(() => {
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

    const authToken: TAuthToken = {
      accessToken: sessionStorage.getItem("access_token") ?? "",
      refreshToken: localStorage.getItem("refresh_token") ?? "",
      expiresIn: sessionStorage.getItem("expires_in") ?? "",
      refreshExpiresIn: localStorage.getItem("refresh_expires_in") ?? "",
    };
    const { accessToken, refreshToken, expiresIn, refreshExpiresIn } =
      authToken;
    const authenticated = selectIsAuthenticated(store.getState());

    if (
      authenticated &&
      (!accessToken || !expiresIn || expiresIn < new Date().toISOString())
    ) {
      if (
        refreshToken &&
        refreshExpiresIn &&
        refreshExpiresIn > new Date().toISOString()
      ) {
        getCredentialHandler({ refreshToken }).then((result) => {
          if (!result && !noRedirect) {
            toastNotification("Session expired, please login again");
            store.dispatch(authSlice.actions.logout());
            redirect("/login");
          }
        });
      } else {
        if (!noRedirect) {
          toastNotification("Session expired, please login again");
          store.dispatch(authSlice.actions.logout());
          redirect("/login");
        }
      }
    }
  }, [pathname, authenticated, noRedirect, getAccessToken]);

  return { setCredential };
};
