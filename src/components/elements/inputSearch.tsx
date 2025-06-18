"use client";

import { VariantProps } from "class-variance-authority";
import {
  Dropdown,
  dropdownVariant,
  getDropdownVariant,
  TDropdownProps,
} from "./dropdown";
import { Input } from "./input";
import { cn } from "@/lib";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const InputSearch = ({
  onSearch,
  placeholder,
  variant,
  disabledMessage,
  onItemSelect,
  defaultValue,
  ...props
}: TDropdownProps &
  VariantProps<typeof dropdownVariant> & {
    placeholder?: string;
    disabledMessage?: string;
    defaultValue?: string;
  }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const onSearchInput = onSearch ?? (() => {});
  const debouncedSearch = useDebouncedCallback(onSearchInput, 200);
  const [pendingChange, setPendingChange] = useState<string>();

  useEffect(() => {
    const value = props.outerValue ?? pendingChange;
    const label = value
      ? (props.options.find((option) => option.value === value)?.label ??
        defaultValue ??
        "")
      : "";

    console.log("InputSearch value", value, label);
    console.log("defaultValue", defaultValue);

    if (inputRef.current && props.options && !props.resetOnSelect) {
      console.log("Setting input value to:", label);
      inputRef.current.value = label;
      setPendingChange(undefined);
    }
  }, [inputRef.current, props.outerValue, defaultValue, pendingChange]);

  return (
    <>
      <Dropdown
        {...props}
        onItemSelect={(item) => {
          if (!props.outerValue) setPendingChange(item.value);
          onItemSelect?.(item);
        }}
        triggerChildren={(open, value) => {
          return (
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
                onSearchInput(inputRef.current?.value ?? "");
              }}
            />
          );
        }}
      ></Dropdown>
    </>
  );
};
