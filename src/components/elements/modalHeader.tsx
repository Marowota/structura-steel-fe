import { cn } from "@/lib";

export const ModalHeader = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "!text-lg-bold text-brand-800 flex items-center justify-center",
        className,
      )}
    >
      {title} <div className="bg-info-300 ml-2 h-[1px] flex-1" />
    </div>
  );
};
