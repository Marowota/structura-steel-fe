"use client";

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
import { ReactNode, useEffect, useRef, useState } from "react";
import { IPaginationResponse } from "@/types/IPagination";
import { useInView } from "react-intersection-observer";

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
  selectionLabel: ReactNode;
  value: string;
};

export const dropdownDefault: TDropdown = {
  label: "",
  selectionLabel: "",
  value: "",
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
  onItemSelect?: (item: TDropdown) => void;
  onSearch?: (value: string) => void;
  triggerChildren?: (open: boolean, value: string) => React.ReactNode;
  disabled?: boolean;
  triggerSelectOnEnter?: boolean;
  resetOnSelect?: boolean;
  paginationInfo?: IPaginationResponse<unknown>;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
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
  resetOnSelect = false,
  paginationInfo,
  onPageChange,
  isLoading = false,
}: TDropdownProps & VariantProps<typeof dropdownVariant>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue || "");
  const [selectingIndex, setSelectingIndex] = useState<number>(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const popoverRef = useRef<HTMLButtonElement>(null);
  const { ref: inViewRef, inView } = useInView();

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, options.length);
    setSelectingIndex(0);
  }, [options]);

  useEffect(() => {
    if (inView && paginationInfo && !paginationInfo.last) {
      onPageChange?.(paginationInfo.pageNo + 1);
    }
  }, [inView]);

  variant = isError ? "error" : variant;

  const onSelectHandler = (item: TDropdown) => {
    const selectedItem = value === item.value ? dropdownDefault : item;
    onItemSelect?.(selectedItem);
    setValue(resetOnSelect ? "" : selectedItem.value);
  };

  return (
    <div
      className="flex w-full flex-col gap-1"
      onBlurCapture={() => setOpen(false)}
    >
      {label && (
        <div className={cn("text-sm-regular", labelClassName)}>
          {label} {required && <span className="text-error-600">*</span>}
        </div>
      )}
      <Popover open={open}>
        <PopoverTrigger
          ref={popoverRef}
          disabled={disabled}
          asChild={!triggerChildren}
          onMouseDownCapture={() => setOpen(true)}
          onBlurCapture={() => setOpen(false)}
          onKeyDownCapture={(e) => {
            if (!open || options.length < 1) return;
            if (e.key === "Enter") {
              e.preventDefault();
              onSelectHandler(options[selectingIndex]);
              if (document.activeElement instanceof HTMLElement)
                document.activeElement.blur();
              document.body.focus();
              return;
            }

            if (e.key === "ArrowDown") {
              const newIndex =
                selectingIndex + 1 < options.length ? selectingIndex + 1 : 0;
              setSelectingIndex(newIndex);
              setTimeout(() => {
                itemRefs.current[newIndex]?.scrollIntoView({
                  block: "nearest",
                });
              }, 0);
            }

            if (e.key === "ArrowUp") {
              const newIndex = selectingIndex - 1 >= 0 ? selectingIndex - 1 : 0;
              setSelectingIndex(newIndex);
              setTimeout(() => {
                itemRefs.current[newIndex]?.scrollIntoView({
                  block: "nearest",
                });
              }, 0);
            }
          }}
        >
          {triggerChildren ? (
            triggerChildren(open, value)
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
                {options.map((item, index) => (
                  <CommandItem
                    ref={(ref) => {
                      itemRefs.current[index] = ref;
                    }}
                    className={cn(
                      "",
                      value === item.value && "bg-brand-50",
                      selectingIndex === index && "bg-info-50",
                      value === item.value &&
                        selectingIndex === index &&
                        "bg-error-50",
                    )}
                    key={item.value}
                    value={item.value}
                    onMouseDown={() => {
                      onSelectHandler(item);
                      setOpen(false);
                    }}
                    onMouseMove={() => setSelectingIndex(index)}
                  >
                    {item.selectionLabel}
                  </CommandItem>
                ))}
                {paginationInfo && isLoading && (
                  <div
                    className={cn(
                      "text-xs-regular text-center",
                      paginationInfo.last && "hidden",
                    )}
                  >
                    Loading...
                  </div>
                )}
                {paginationInfo && !isLoading && (
                  <div
                    ref={inViewRef}
                    className={cn(
                      "text-xs-regular text-center",
                      paginationInfo.last && "hidden",
                    )}
                  >
                    Next Page
                  </div>
                )}
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
