"use client";

import { cn } from "@/lib";

export const Modal = ({
  isOpen,
  onClose,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}) => {
  return isOpen ? (
    <div className="absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center">
      <div
        className="absolute h-full w-full bg-black opacity-50"
        onClick={() => {
          onClose(false);
        }}
      />
      <div className={cn("absolute rounded-md bg-white px-3 py-4", className)}>
        {children}
      </div>
    </div>
  ) : (
    <></>
  );
};
