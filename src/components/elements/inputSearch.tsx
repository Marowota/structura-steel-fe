import { VariantProps } from "class-variance-authority";
import {
  Dropdown,
  dropdownVariant,
  getDropdownVariant,
  TDropdownProps,
} from "./dropdown";
import { Input } from "./input";
import { cn } from "@/lib";
import { useRef } from "react";

export const InputSearch = ({
  onSearch,
  placeholder,
  variant,
  ...props
}: TDropdownProps &
  VariantProps<typeof dropdownVariant> & {
    placeholder?: string;
  }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Dropdown
        {...props}
        onItemSelect={(value) => {
          if (inputRef.current) {
            inputRef.current.value =
              props.options.find((option) => option.value === value)?.label ??
              "";
          }
        }}
        triggerChildren={(open) => (
          <Input
            ref={inputRef}
            className={cn(getDropdownVariant(open, variant), "w-full")}
            placeholder={placeholder}
            onKeyDownCapture={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSearch?.((e.target as HTMLInputElement).value);
              }
            }}
          />
        )}
      ></Dropdown>
    </>
  );
};
