"use client";

import { ReactNode } from "react";

export const ModalSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <>
      <div className="border-brand-300 flex flex-col gap-2 rounded-md border px-3 py-2 text-sm">
        <div className="text-md-semibold text-info-800">{title}</div>
        {children}
      </div>
    </>
  );
};
