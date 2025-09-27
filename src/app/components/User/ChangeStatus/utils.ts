import { commons } from "app/i18n/types";
import { UserModal } from "utils/modal";
import { object, string } from "yup";

export interface BaseDialogProps extends UserModal {
  onSuccess: () => void;
}

export const handleStartValidations = object({
  startOrEndDate: string().required(commons.REQUIRED_FIELD),
});

export const handleEndValidations = object({
  startOrEndDate: string().required(commons.REQUIRED_FIELD),
  endType: string().required(commons.REQUIRED_FIELD),
  endReason: string().required(commons.REQUIRED_FIELD),
});
