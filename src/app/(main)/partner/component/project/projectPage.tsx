"use client";

import {
  Button,
  EBaseActions,
  Input,
  TTableActionsProps,
} from "@/components/elements";
import { Row } from "@tanstack/react-table";

import { Suspense, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { TableFilter } from "@/components/elements/tableFilter";
import { useDebouncedCallback } from "use-debounce";
import {
  TProject,
  useGetProjectsByPartner,
} from "../../api/getProjectsByPartner";
import { projectColumns } from "./projectTable";
import { DEFAULT_PAGINATION_PARAMS } from "@/types/IPagination";
import { ProjectCreateModal } from "./ProjectCreateModal";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { ProjectDeleteModal } from "./projectDeleteModal";

export default function ProjectPageComponent({
  partnerId,
  paramsKey,
}: {
  partnerId: string;
  paramsKey: string;
}) {
  const [isOpenCreate, setIsOpenCreate] = useState({
    isOpen: false,
    editId: undefined as string | undefined,
  });
  const [openDetailId, setOpenDetailId] = useState();
  const [openDeleteId, setOpenDeleteId] = useState();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  const onRowClick = (row: Row<TProject>) => {
    console.log(row.getValue("id"));
    setOpenDetailId(row.getValue("id"));
    // router.push(`/project/${row.getValue("id")}`);
  };

  const onEdit = (row: Row<TProject>) => {
    setIsOpenCreate({
      isOpen: true,
      editId: row.getValue("id"),
    });
  };

  const onDelete = (row: Row<TProject>) => {
    setOpenDeleteId(row.getValue("id"));
  };

  const tableActions: TTableActionsProps<TProject>[] = [
    {
      action: EBaseActions.EDIT,
      icon: <Edit className="h-4 w-4" />,
      onClick: onEdit,
    },
    {
      action: EBaseActions.DELETE,
      icon: <Trash className="h-4 w-4" />,
      onClick: onDelete,
    },
  ];

  return (
    <>
      <ProjectCreateModal
        isOpen={isOpenCreate.isOpen}
        onClose={() =>
          setIsOpenCreate({
            isOpen: false,
            editId: undefined,
          })
        }
        editId={isOpenCreate.editId}
        partnerId={partnerId}
      />
      <ProjectDetailModal
        isOpen={openDetailId ?? false}
        onClose={() => setOpenDetailId(undefined)}
        id={openDetailId}
        partnerId={partnerId}
      />
      <ProjectDeleteModal
        isOpen={openDeleteId ?? false}
        onClose={() => setOpenDeleteId(undefined)}
        deleteId={openDeleteId}
        partnerId={partnerId}
      />
      <div id={paramsKey} className="flex flex-col gap-3 pt-3">
        <div className="flex">
          <Input
            placeholder="Search project"
            className="min-w-64"
            onChange={(e) => {
              debouncedSearch(e.currentTarget.value);
            }}
          />
          <div className="ml-auto">
            <Button
              size={"md"}
              onClick={() =>
                setIsOpenCreate({
                  isOpen: true,
                  editId: undefined,
                })
              }
            >
              New project
            </Button>
          </div>
        </div>
        <Suspense>
          <TableFilter
            numberTitle="Total projects: "
            columns={projectColumns}
            dataHook={useGetProjectsByPartner}
            search={search}
            paramsDefault={{
              ...DEFAULT_PAGINATION_PARAMS,
              partnerId: partnerId,
            }}
            paramsKey={paramsKey}
            onRowClick={onRowClick}
            actions={tableActions}
          />
        </Suspense>
      </div>
    </>
  );
}
