import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const inputVariant = cva(
  "text-md-regular rounded-md border-1 px-3 py-2 active:ring-4 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
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
  },
);

export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariant> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant, className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariant({ variant, className }), "")}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
