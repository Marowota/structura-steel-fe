import { EUserRole } from "@/app/(main)/user/api/getUsers";
import { ReactNode, useContext } from "react";
import { UserContext } from "./AuthorizedLayout";
import { PageNotFound } from "./PageNotFound";
import { useGetMyProfile } from "@/app/(main)/account/api/getMyProfile";

export const ProtectedPage = ({
  acceptedRoles,
  blockedRoles,
  children,
}: {
  acceptedRoles?: EUserRole[];
  blockedRoles?: EUserRole[];
  children?: ReactNode;
}) => {
  const userInfo = useContext(UserContext);
  const { data: userDetail } = useGetMyProfile({
    params: { username: userInfo?.preferred_username },
  });

  return (
    <>
      {acceptedRoles || blockedRoles ? (
        userDetail?.realmRole &&
        (acceptedRoles
          ? acceptedRoles.includes(userDetail?.realmRole)
          : true) &&
        (blockedRoles
          ? !blockedRoles.includes(userDetail?.realmRole)
          : true) ? (
          children
        ) : (
          <PageNotFound />
        )
      ) : (
        children
      )}
    </>
  );
};
