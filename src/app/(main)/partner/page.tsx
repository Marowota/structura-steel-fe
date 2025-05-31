"use client";
import {
  Button,
  EBaseActions,
  Input,
  TTableActionsProps,
} from "@/components/elements";
import { TPartner, useGetPartners } from "./api/getPartners";
import { Row } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Suspense, useState } from "react";
import { TableFilter } from "@/components/elements/tableFilter";
import { useDebouncedCallback } from "use-debounce";
import { partnerColumn } from "./component/partner/partnerTable";
import { useRouter } from "next/navigation";
import { PartnerCreateModal } from "./component/partner/partnerCreateModal";
import { PartnerDeleteModal } from "./component/partner/partnerDeleteModal";

export default function PartnerPage() {
  const [isOpenCreate, setIsOpenCreate] = useState({
    isOpen: false,
    editId: undefined,
  });
  const [openDeleteId, setOpenDeleteId] = useState();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  const onRowClick = (row: Row<TPartner>) => {
    console.log(row.getValue("id"));
    router.push(`/partner/${row.getValue("id")}`);
  };

  const onEdit = (row: Row<TPartner>) => {
    setIsOpenCreate({
      isOpen: true,
      editId: row.getValue("id"),
    });
  };

  const onDelete = (row: Row<TPartner>) => {
    setOpenDeleteId(row.getValue("id"));
  };

  const tableActions: TTableActionsProps<TPartner>[] = [
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
      <PartnerCreateModal
        isOpen={isOpenCreate.isOpen}
        onClose={() =>
          setIsOpenCreate({
            isOpen: false,
            editId: undefined,
          })
        }
        editId={isOpenCreate.editId}
      />

      <PartnerDeleteModal
        isOpen={openDeleteId ?? false}
        onClose={() => setOpenDeleteId(undefined)}
        deleteId={openDeleteId}
      />
      <div className="flex h-full flex-col gap-3 pt-3">
        <div className="flex">
          <Input
            placeholder="Search partner"
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
              New partner
            </Button>
          </div>
        </div>
        <Suspense>
          <TableFilter
            numberTitle="Total partner: "
            columns={partnerColumn}
            dataHook={useGetPartners}
            search={search}
            onRowClick={onRowClick}
            actions={tableActions}
          />
        </Suspense>
      </div>
    </>
  );
}
