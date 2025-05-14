import { VariantProps } from "class-variance-authority";
import {
  Dropdown,
  dropdownVariant,
  getDropdownVariant,
  TDropdownProps,
} from "./dropdown";
import { Input } from "./input";
import { cn } from "@/lib";

export const InputSearch = ({
  onSearch,
  placeholder,
  variant,
  ...props
}: TDropdownProps &
  VariantProps<typeof dropdownVariant> & {
    placeholder?: string;
  }) => {
  return (
    <>
      <Dropdown
        {...props}
        triggerChildren={(open) => (
          <Input
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
