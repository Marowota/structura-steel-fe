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
import { useDebouncedCallback } from "use-debounce";

export const InputSearch = ({
  onSearch,
  placeholder,
  variant,
  disabledMessage,
  onItemSelect,
  ...props
}: TDropdownProps &
  VariantProps<typeof dropdownVariant> & {
    placeholder?: string;
    disabledMessage?: string;
  }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const onSearchInput = onSearch ?? (() => {});
  const debouncedSearch = useDebouncedCallback(onSearchInput, 300);

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
          debouncedSearch(inputRef.current?.value ?? "");
          onItemSelect?.(value);
        }}
        triggerChildren={(open, value) => (
          <Input
            onBlur={() => {
              if (inputRef.current) {
                inputRef.current.value =
                  props.options.find((option) => option.value === value)
                    ?.label ?? "";
              }
            }}
            required={props.required}
            disabled={props.disabled}
            isError={props.isError}
            ref={inputRef}
            className={cn(getDropdownVariant(open, variant), "w-full")}
            placeholder={props.disabled ? disabledMessage : placeholder}
            onChange={(e) => {
              debouncedSearch(e.target.value);
            }}
            onFocusCapture={() => {
              debouncedSearch(inputRef.current?.value ?? "");
            }}
          />
        )}
      ></Dropdown>
    </>
  );
};
