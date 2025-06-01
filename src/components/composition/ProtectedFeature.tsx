import { EUserRole } from "@/app/(main)/user/api/getUsers";
import { ReactNode, useContext } from "react";
import { UserContext } from "./AuthorizedLayout";
import { useGetUserDetail } from "@/app/(main)/user/api/getUsersDetail";

export const ProtectedFeature = ({
  acceptedRoles,
  children,
}: {
  acceptedRoles?: EUserRole[];
  children?: ReactNode;
}) => {
  const userInfo = useContext(UserContext);
  const { data: userDetail } = useGetUserDetail({
    params: { username: userInfo?.preferred_username },
  });
  return (
    <>
      {acceptedRoles
        ? userDetail?.realmRole &&
          acceptedRoles.includes(userDetail?.realmRole) &&
          children
        : children}
    </>
  );
};
