import { commons } from "app/i18n/types";
import { RoleModal } from "utils/modal";
import { object, string } from "yup";

export interface BaseDialogProps extends RoleModal {
  onSuccess: () => void;
}

export interface FormState {
  id?: string;
  name: string;
  code: string;
  fullAccess: string;
}

export const handleValidations = object({
  name: string().trim().required(commons.REQUIRED_FIELD),
});
