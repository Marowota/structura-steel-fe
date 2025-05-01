import toast from "react-hot-toast";

export enum EToastType {
  SUCCESS = "#008733",
  ERROR = "#d2392d",
  INFO = "#0079b9",
  WARNING = "#d67800",
}

export const toastNotification = (
  message: string,
  type: EToastType = EToastType.INFO,
) => {
  toast(message, {
    position: "top-center",
    duration: 3000,
    style: { background: type, color: "white" },
  });
};
