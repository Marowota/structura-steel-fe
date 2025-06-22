"use client";
import {
  Button,
  EBaseActions,
  Input,
  TTableActionsProps,
} from "@/components/elements";
import { EUserRole, TUser, useGetUsers } from "./api/getUsers";
import { Row } from "@tanstack/react-table";
import { Edit, SquareAsterisk, Trash } from "lucide-react";
import { Suspense, useContext, useState } from "react";
import { TableFilter } from "@/components/elements/tableFilter";
import { useDebouncedCallback } from "use-debounce";
import { userColumns } from "./component/userTable";
import { UserCreateModal } from "./component/createUserModal";
import { UserDeleteModal } from "./component/deleteUserModal";
import { UserContext } from "@/components/composition";
import { useGetUserDetail } from "./api/getUsersDetail";
import { ProtectedFeature } from "@/components/composition/ProtectedFeature";
import { ChangePasswordModal } from "./component/changePasswordModal";

export default function UserPage() {
  const userInfo = useContext(UserContext);
  const userDetail = useGetUserDetail({
    params: { username: userInfo?.preferred_username },
  });
  const [isOpenCreate, setIsOpenCreate] = useState({
    isOpen: false,
    editId: undefined,
    username: undefined,
  });
  const [isOpenDelete, setIsOpenDelete] = useState({
    isOpen: false,
    deleteId: undefined,
    username: undefined,
  });
  const [isOpenResetPassword, setIsOpenResetPassword] = useState({
    email: undefined,
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  const onRowClick = (row: Row<TUser>) => {
    console.log(row.getValue("id"));
  };

  const onEdit = (row: Row<TUser>) => {
    setIsOpenCreate({
      isOpen: true,
      editId: row.getValue("id"),
      username: row.getValue("username"),
    });
  };

  const onDelete = (row: Row<TUser>) => {
    setIsOpenDelete({
      isOpen: true,
      deleteId: row.getValue("id"),
      username: row.getValue("username"),
    });
  };

  const onResetPassword = (row: Row<TUser>) => {
    setIsOpenResetPassword({
      email: row.getValue("email"),
    });
  };

  const tableActions: TTableActionsProps<TUser>[] =
    userDetail.data?.realmRole === EUserRole.ROLE_ADMIN
      ? [
          {
            action: EBaseActions.EDIT,
            icon: <Edit className="h-4 w-4" />,
            onClick: onEdit,
          },
          {
            action: EBaseActions.CHANGE_PASSWORD,
            icon: <SquareAsterisk className="h-4 w-4" />,
            onClick: onResetPassword,
          },
          {
            action: EBaseActions.DELETE,
            icon: <Trash className="h-4 w-4" />,
            onClick: onDelete,
            hiddenRule: (row) => {
              const userId = row.getValue("id");
              return userId === userDetail.data?.id;
            },
          },
        ]
      : [];

  return (
    <>
      <ProtectedFeature acceptedRoles={[EUserRole.ROLE_ADMIN]}>
        <UserCreateModal
          isOpen={isOpenCreate.isOpen}
          onClose={() =>
            setIsOpenCreate({
              isOpen: false,
              editId: undefined,
              username: undefined,
            })
          }
          editId={isOpenCreate.editId}
          username={isOpenCreate.username}
        />

        <UserDeleteModal
          isOpen={isOpenDelete.isOpen ?? false}
          onClose={() =>
            setIsOpenDelete({
              isOpen: false,
              deleteId: undefined,
              username: undefined,
            })
          }
          deleteId={isOpenDelete.deleteId}
          username={isOpenDelete.username}
        />
        <ChangePasswordModal
          isOpen={!!isOpenResetPassword.email}
          onClose={() =>
            setIsOpenResetPassword({
              email: undefined,
            })
          }
          email={isOpenResetPassword.email ?? ""}
        />
      </ProtectedFeature>

      <div className="flex h-full flex-col gap-3 pt-3">
        <div className="flex">
          <Input
            placeholder="Search user"
            className="min-w-64"
            onChange={(e) => {
              debouncedSearch(e.currentTarget.value);
            }}
          />
          <ProtectedFeature acceptedRoles={[EUserRole.ROLE_ADMIN]}>
            <div className="ml-auto">
              <Button
                size={"md"}
                onClick={() =>
                  setIsOpenCreate({
                    isOpen: true,
                    editId: undefined,
                    username: undefined,
                  })
                }
              >
                New user
              </Button>
            </div>
          </ProtectedFeature>
        </div>
        <Suspense>
          <TableFilter
            numberTitle="Total user: "
            columns={userColumns}
            dataHook={useGetUsers}
            search={search}
            onRowClick={onRowClick}
            actions={tableActions}
          />
        </Suspense>
      </div>
    </>
  );
}
