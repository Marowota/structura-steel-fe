import * as React from "react";
import { Slot } from "@radix-ui/themes";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "rounded-lg cursor-pointer w-fit h-fit transition-all duration-100 active:scale-90 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-600 hover:bg-brand-800 active:bg-brand-600 active:ring-brand-200 text-white active:ring-2 disabled:bg-neutral-200 disabled:text-white",
        secondary:
          "bg-white text-neutral-700 ring ring-neutral-200 hover:bg-neutral-100 active:bg-white active:ring-2 active:ring-neutral-200 disabled:bg-neutral-200 disabled:text-white",
        tertiary:
          "bg-white text-neutral-700 hover:bg-neutral-100 active:bg-white disabled:bg-neutral-200 disabled:text-white",
        destructive:
          "bg-error-600 hover:bg-error-800 active:bg-error-600 active:ring-error-500 text-white active:ring-2 disabled:bg-neutral-200 disabled:text-white",
        navbar:
          "mt-4 w-full overflow-hidden bg-white text-nowrap hover:bg-gray-100 active:bg-gray-200 active:ring-2 active:ring-gray-100 disabled:opacity-50",
        navbarSelected:
          "mt-4 w-full overflow-hidden bg-gray-200 text-nowrap hover:bg-gray-100 active:bg-gray-200 active:ring-2 active:ring-gray-100 disabled:opacity-50",
      },
      size: {
        lg: "!text-md-medium min-h-12 px-4 py-3",
        md: "!text-md-medium min-h-10 px-3 py-2",
        sm: "!text-sm-medium min-h-9 px-3 py-2",
        nav: "!text-md-semibold min-h-10 px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
);

const buttonLinkVariants = cva("", {
  variants: {
    variant: {
      primary: "text-brand-700",
      secondary: "text-neutral-700",
      tertiary: "text-neutral-700",
      destructive: "text-error-700",
      navbar: "",
      navbarSelected: "",
    },
    size: {
      lg: "!text-lg-semibold",
      md: "!text-md-semibold",
      sm: "!text-sm-semibold",
      nav: "!text-md-semibold",
    },
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLink?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLink, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          isLink
            ? buttonLinkVariants({ variant, size, className })
            : buttonVariants({ variant, size, className }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
