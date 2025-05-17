"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cva, VariantProps } from "class-variance-authority";

export const dropdownVariant = cva(
  "text-md-regular rounded-md border-1 w-full px-3 py-2 active:ring-4 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
  {
    variants: {
      variant: {
        normal:
          "border-gray-300 focus-visible:border-purple-300 ring-purple-50",
        success:
          "border-success-300 focus-visible:border-success-500 ring-success-50",
        error: "border-error-300 focus-visible:border-error-500 ring-error-50",
        nothing: "",
      },
    },
    defaultVariants: {
      variant: "normal",
    },
  },
);

export type TDropdown = {
  label: string;
  value: string;
};

export type TDropdownProps = {
  className?: string;
  isError?: boolean;
  options: TDropdown[];
  label?: string;
  labelClassName?: string;
  required?: boolean;
  errorMessage?: string;
  initialValue?: string;
  onItemSelect?: (value: string) => void;
  onSearch?: (value: string) => void;
  triggerChildren?: (open: boolean) => React.ReactNode;
  disabled?: boolean;
};

export const getDropdownVariant = (open: boolean, variant?: string | null) =>
  cn(
    open && "ring-2 outline-none",
    open && (variant == "normal" || variant == undefined)
      ? "border-purple-300 ring-purple-50"
      : variant == "error"
        ? "border-error-300 ring-error-50"
        : variant == "success"
          ? "border-success-300 ring-success-50"
          : "",
  );

export function Dropdown({
  variant,
  className,
  isError,
  options,
  label,
  labelClassName,
  required,
  errorMessage,
  initialValue,
  onItemSelect,
  onSearch,
  triggerChildren,
  disabled = false,
}: TDropdownProps & VariantProps<typeof dropdownVariant>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(initialValue || "");

  variant = isError ? "error" : variant;

  console.log(options);

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <div className={cn("text-sm-regular", labelClassName)}>
          {label} {required && <span className="text-error-600">*</span>}
        </div>
      )}
      <Popover open={open}>
        <PopoverTrigger
          disabled={disabled}
          asChild={!triggerChildren}
          onFocusCapture={() => setOpen(true)}
          onBlurCapture={() => setOpen(false)}
        >
          {triggerChildren ? (
            triggerChildren(open)
          ) : (
            <Button
              disabled={disabled}
              noVariant
              role="combobox"
              aria-expanded={open}
              className={cn(
                dropdownVariant({
                  variant,
                  className,
                }),
                "flex items-center",
                getDropdownVariant(open, variant),
              )}
            >
              {value
                ? options.find((item) => item.value === value)?.label
                : "Select..."}
              <ChevronDown className="ml-auto opacity-50" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="border-brand-300 pointer-events-auto w-[var(--radix-popover-trigger-width)] bg-white p-0"
        >
          <Command>
            {onSearch && (
              <CommandInput
                placeholder="Search"
                className="h-9"
                onKeyDownCapture={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSearch?.((e.target as HTMLInputElement).value);
                  }
                }}
              />
            )}
            <CommandList>
              <CommandEmpty>No matched found.</CommandEmpty>
              <CommandGroup className="max-h-40 overflow-y-auto">
                {options.map((item) => (
                  <CommandItem
                    className={cn(
                      "hover:bg-info-50",
                      value === item.value && "bg-brand-50",
                    )}
                    key={item.value}
                    value={item.value}
                    onSelect={() => {
                      onItemSelect?.(item.value === value ? "" : item.value);
                      setValue(item.value === value ? "" : item.value);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {isError && errorMessage && (
        <div className="text-error-600 text-xs-semibold">{errorMessage}</div>
      )}
    </div>
  );
}
