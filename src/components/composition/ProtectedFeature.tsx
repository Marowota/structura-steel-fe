import { EUserRole } from "@/app/(main)/user/api/getUsers";
import { ReactNode, useContext } from "react";
import { UserContext } from "./AuthorizedLayout";
import { useGetMyProfile } from "@/app/(main)/account/api/getMyProfile";

export const ProtectedFeature = ({
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
  console.log("userDetail", userDetail);
  return (
    <>
      {acceptedRoles || blockedRoles
        ? userDetail?.realmRole &&
          (acceptedRoles
            ? acceptedRoles.includes(userDetail?.realmRole)
            : true) &&
          (blockedRoles
            ? !blockedRoles.includes(userDetail?.realmRole)
            : true) &&
          children
        : children}
    </>
  );
};
