import { ToastQueue } from "@react-stately/toast";
import type { Toast } from "./constants";
import "./index.scss";

export const toastQueue = new ToastQueue<Toast>({
  maxVisibleToasts: 5,
  hasExitAnimation: true,
});
