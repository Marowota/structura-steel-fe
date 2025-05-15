"use client";
import {
  InputSearch,
  Modal,
  ModalHeader,
  ModalSection,
} from "@/components/elements";
import { Dropdown } from "@/components/elements/dropdown";
import { useGetPartners } from "../../partner/api/getPartners";
import { IPagination } from "@/types/IPagination";
import { useState } from "react";

export const mapArrayToTDropdown = <T,>(
  inputArray: T[],
  labelField: keyof T,
  valueField: keyof T,
) => {
  const mappedArray = inputArray.map((item: T) => ({
    label: item[labelField] as string,
    value: item[valueField] as string,
  }));
  return mappedArray;
};

export const OrderCreateModal = ({
  isOpen,
  onClose,
  editId,
}: {
  isOpen: boolean;
  onClose: () => void;
  editId?: string;
}) => {
  const defaultParams: IPagination = {
    pageNo: 0,
    pageSize: 10,
    sortBy: "partnerName",
    sortDir: "asc",
    search: "",
  };

  const [partnerParams, setPartnerParams] =
    useState<IPagination>(defaultParams);

  const { data: partners } = useGetPartners({ params: partnerParams });
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="flex flex-col gap-2">
      <ModalHeader title="Create Order" />
      <form className="flex min-h-96 flex-row gap-4">
        <ModalSection title="General Information">
          <div className="grid min-w-72 grid-rows-3 gap-2">
            <InputSearch
              label="Partner"
              options={mapArrayToTDropdown(
                partners?.content ?? [],
                "partnerName",
                "id",
              )}
              onSearch={(value) => {
                setPartnerParams((prev) => ({
                  ...prev,
                  search: value,
                }));
              }}
            />
            <InputSearch label="Project" options={[]} />
            <Dropdown label="Order type" options={[]} />
          </div>
        </ModalSection>
        <ModalSection title="Products">
          <InputSearch placeholder="Search" options={[]} />
          <div className="flex min-w-96 flex-col gap-2"></div>
        </ModalSection>
      </form>
    </Modal>
  );
};
