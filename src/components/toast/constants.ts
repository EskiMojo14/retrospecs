import type { ReactNode } from "react";
import type { ButtonColor } from "~/components/button/constants";

export const toastTypes = [
  "success",
  "info",
  "warning",
  "error",
  "default",
] as const;

export type ToastType = (typeof toastTypes)[number];

export interface ToastActionsRenderProps {
  close: () => void;
}

export interface Toast {
  type?: ToastType;
  symbol?: ReactNode;
  title?: ReactNode;
  description: ReactNode;
  actions?: ReactNode | ((props: ToastActionsRenderProps) => ReactNode);
}

export const toastSymbols: Record<ToastType, string> = {
  success: "check_circle",
  info: "info",
  warning: "warning",
  error: "error",
  default: "campaign",
};

export const toastButtonColor: Record<ToastType, ButtonColor | undefined> = {
  success: "green",
  info: undefined,
  warning: "amber",
  error: "red",
  default: "gold",
};
