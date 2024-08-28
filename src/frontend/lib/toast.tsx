import CustomToast from "@/frontend/components/common/CustomToast";
import { toast } from "sonner";

export const successToast = (message: string) => {
  toast.custom((t) => <CustomToast t={t} message={message} />);
};

export const errorToast = (message: string) => {
  toast.custom((t) => <CustomToast variant="error" t={t} message={message} />);
};

export const greenToast = (message: string) => {
  toast.custom((t) => <CustomToast variant="green" t={t} message={message} />);
};
