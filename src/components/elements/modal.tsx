"use client";

export const Modal = ({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
}) => {
  return isOpen ? (
    <div className="absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center">
      <div
        className="absolute h-full w-full bg-black opacity-50"
        onClick={() => {
          setIsOpen(false);
        }}
      ></div>
      <div className="absolute rounded-md bg-white px-3 py-4">{children}</div>
    </div>
  ) : (
    <></>
  );
};
