"use client";

import { cn } from "@/lib";
import { ReactNode } from "react";

export const ModalSection = ({
  title,
  children,
  className,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div
        className={cn(
          "border-brand-300 flex flex-col gap-2 rounded-md border px-3 py-2 text-sm",
          className,
        )}
      >
        <div className="text-md-semibold text-info-800">{title}</div>
        {children}
      </div>
    </>
  );
};
