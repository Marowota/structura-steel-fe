import * as React from "react";
import { useId } from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const checkboxVariant = cva(
  "h-4 w-4 rounded border-1 active:ring-4 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50 cursor-pointer appearance-none",
  {
    variants: {
      variant: {
        normal: [
          "border-gray-300 bg-white",
          "checked:bg-purple-600 checked:border-purple-600",
          "focus-visible:border-purple-300 ring-purple-50",
          "checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%270%200%2016%2016%27%20fill%3D%27none%27%20stroke%3D%27%23fff%27%20stroke-width%3D%272%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpolyline%20points%3D%273.75%208.25%206.25%2011%2012%204.75%27%2F%3E%3C%2Fsvg%3E')]",
          "checked:bg-no-repeat checked:bg-center",
        ],
        success: [
          "border-success-300 bg-white",
          "checked:bg-success-600 checked:border-success-600",
          "focus-visible:border-success-500 ring-success-50",
          "checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%270%200%2016%2016%27%20fill%3D%27none%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Ccircle%20cx%3D%278%27%20cy%3D%278%27%20r%3D%274%27%20fill%3D%27%23fff%27%2F%3E%3C%2Fsvg%3E')]",
          "checked:bg-no-repeat checked:bg-center",
        ],
        error: [
          "border-error-300 bg-white",
          "checked:bg-error-600 checked:border-error-600",
          "focus-visible:border-error-500 ring-error-50",
          "checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%270%200%2016%2016%27%20fill%3D%27none%27%20stroke%3D%27%23fff%27%20stroke-width%3D%272.5%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M4.5%204.5l7%207m0-7l-7%207%27%2F%3E%3C%2Fsvg%3E')]",
          "checked:bg-no-repeat checked:bg-center",
        ],
        nothing: "",
      },
      checkboxSize: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      variant: "normal",
      checkboxSize: "md",
    },
  },
);

export interface CheckboxProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof checkboxVariant> {
  label?: string;
  labelClassName?: string;
  isError?: boolean;
  errorMessage?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      variant,
      checkboxSize,
      className,
      label,
      labelClassName,
      required,
      isError,
      errorMessage,
      id: propId,
      ...props
    },
    ref,
  ) => {
    // Generate a unique ID if one isn't provided
    const generatedId = useId();
    const id = propId || generatedId;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={id}
            className={cn(
              checkboxVariant({
                variant: isError ? "error" : variant,
                checkboxSize,
                className,
              }),
            )}
            ref={ref}
            {...props}
          />
          {label && (
            <label
              htmlFor={id}
              className={cn("text-sm-regular cursor-pointer", labelClassName)}
            >
              {label} {required && <span className="text-error-600">*</span>}
            </label>
          )}
        </div>
        {isError && errorMessage && (
          <div className="text-error-600 text-xs-semibold">{errorMessage}</div>
        )}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
