import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const inputVariant = cva(
  "rounded-md border-1 w-full active:ring-4 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
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
      inputSize: {
        sm: "text-sm-regular px-2 py-1",
        md: "text-md-regular px-3 py-2",
        lg: "text-lg-regular px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "normal",
      inputSize: "md",
    },
  },
);

export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariant> {
  label?: string;
  labelClassName?: string;
  isError?: boolean;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant,
      inputSize,
      className,
      type,
      label,
      labelClassName,
      required,
      isError,
      errorMessage,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col items-start gap-1">
        {label && (
          <div className={cn("text-sm-regular", labelClassName)}>
            {label} {required && <span className="text-error-600">*</span>}
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariant({
              variant: isError ? "error" : variant,
              className,
              inputSize,
            }),
            "",
          )}
          ref={ref}
          step={type === "number" ? "any" : undefined}
          {...props}
        />
        {isError && errorMessage && (
          <div className="text-error-600 text-xs-semibold">{errorMessage}</div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
