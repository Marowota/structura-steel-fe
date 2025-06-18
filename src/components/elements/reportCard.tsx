import { cn } from "@/lib";

export enum EReportCardVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  SUCCESS = "success",
  ERROR = "error",
}

export type ReportCardVariant = {
  outline: string;
  icon: string;
  title: string;
  description: string;
};

export const reportCardVariant = new Map<EReportCardVariant, ReportCardVariant>(
  [
    [
      EReportCardVariant.PRIMARY,
      {
        outline: "border-info-300",
        icon: "bg-brand-100 text-brand-900",
        title: "text-info-800",
        description: "text-gray-600",
      },
    ],
    [
      EReportCardVariant.SECONDARY,
      {
        outline: "border-brand-300",
        icon: "bg-info-100 text-info-900",
        title: "text-brand-800",
        description: "text-gray-600",
      },
    ],
    [
      EReportCardVariant.SUCCESS,
      {
        outline: "border-info-300",
        icon: "bg-success-100 text-success-900",
        title: "text-info-800",
        description: "text-gray-600",
      },
    ],
    [
      EReportCardVariant.ERROR,
      {
        outline: "border-info-300",
        icon: "bg-error-100 text-error-900",
        title: "text-info-800",
        description: "text-gray-600",
      },
    ],
  ],
);
export const ReportCard = ({
  icon,
  title,
  description,
  variant = EReportCardVariant.PRIMARY,
  className,
}: {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  variant: EReportCardVariant;
  className?: string;
}) => {
  const cardVariant =
    reportCardVariant.get(variant) ||
    reportCardVariant.get(EReportCardVariant.PRIMARY)!;
  return (
    <>
      <div
        className={cn(
          "flex min-w-fit items-center gap-2 rounded-md border px-3 py-2",
          cardVariant.outline,
          className,
        )}
      >
        <div className={cn("rounded-md p-3", cardVariant.icon)}>{icon}</div>
        <div>
          <div
            className={cn(
              "!text-sm-regular text-gray-600",
              cardVariant.description,
            )}
          >
            {title}
          </div>
          <div className={cn("!text-xl-semibold", cardVariant.title)}>
            {description}
          </div>
        </div>
      </div>
    </>
  );
};
