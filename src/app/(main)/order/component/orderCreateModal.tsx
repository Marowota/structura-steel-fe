"use client";
import {
  Button,
  InputSearch,
  Modal,
  ModalHeader,
  ModalSection,
} from "@/components/elements";
import { Dropdown } from "@/components/elements/dropdown";
import { useGetPartners } from "../../partner/api/getPartners";
import { IPagination } from "@/types/IPagination";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { EOrderType, PostOrderDTO } from "../api/postOrder";

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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    resetField,
    formState: { errors },
  } = useForm<PostOrderDTO>();
  const itemSelectNumberHandler = (
    value: string,
    field: keyof PostOrderDTO,
  ) => {
    const valueNumber: number = Number.parseInt(value);
    if (!isNaN(valueNumber)) {
      setValue(field, valueNumber, {
        shouldValidate: true,
      });
    } else {
      resetField(field);
    }
  };

  const currentPartnerId = watch("partnerId");
  const currentProjectId = watch("projectId");

  const defaultParams: IPagination = {
    pageNo: 0,
    pageSize: 10,
    sortBy: "partnerName",
    sortDir: "asc",
    search: "",
  };

  const [partnerParams, setPartnerParams] =
    useState<IPagination>(defaultParams);
  const [projectParams, setProjectParams] = useState({ search: "" });

  const { data: partners } = useGetPartners({ params: partnerParams });
  const projects =
    partners?.content
      .find((partner) => partner.id === currentPartnerId)
      ?.partnerProjects.filter((project) =>
        project.projectName.match(projectParams.search),
      ) ?? [];

  useEffect(() => {
    resetField("projectId");
  }, [currentPartnerId]);

  const searchPartnersHandler = (value: string) => {
    setPartnerParams((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const onSubmit = () => {
    // Handle form submission
    console.log("Form submitted");
  };

  const onCloseHandler = () => {
    reset({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseHandler}
      className="flex flex-col gap-2"
    >
      <ModalHeader title="Create Order" />
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex min-h-96 flex-row gap-4">
          <ModalSection title="General Information">
            <div className="flex min-w-72 flex-col gap-2">
              <InputSearch
                label="Partner"
                options={mapArrayToTDropdown(
                  partners?.content ?? [],
                  "partnerName",
                  "id",
                )}
                onSearch={searchPartnersHandler}
                onItemSelect={(value) => {
                  itemSelectNumberHandler(value, "partnerId");
                }}
                {...register("partnerId", {
                  required: "Partner is required",
                })}
                required
                isError={errors.partnerId ? true : false}
                errorMessage={errors.partnerId?.message}
              />
              <InputSearch
                label="Project"
                options={mapArrayToTDropdown(projects, "projectName", "id")}
                onSearch={(value) => {
                  setProjectParams((prev) => ({
                    ...prev,
                    search: value,
                  }));
                }}
                onItemSelect={(value) => {
                  itemSelectNumberHandler(value, "projectId");
                }}
                {...register("projectId", {
                  required: "Project is required",
                })}
                required
                isError={errors.projectId ? true : false}
                errorMessage={errors.projectId?.message}
                disabled={!currentPartnerId}
                disabledMessage="Please select a partner first"
                key={currentPartnerId}
              />
              <Dropdown
                label="Order type"
                options={mapArrayToTDropdown(
                  Object.entries(EOrderType).map(([key, value]) => ({
                    label: value,
                    value: key,
                  })),
                  "label",
                  "value",
                )}
                onItemSelect={(value) => {
                  setValue("orderType", value, {
                    shouldValidate: true,
                  });
                }}
                {...register("orderType", {
                  required: "Order type is required",
                })}
                required
                isError={errors.orderType ? true : false}
                errorMessage={errors.orderType?.message}
                disabled={!currentProjectId}
              />
            </div>
          </ModalSection>
          <ModalSection title="Products">
            <InputSearch placeholder="Search" options={[]} />
            <div className="flex min-w-96 flex-col gap-2"></div>
          </ModalSection>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => onCloseHandler()}
            type="button"
            size={"sm"}
            variant={"secondary"}
          >
            Cancel
          </Button>
          <Button size={"sm"}>{editId ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
};
