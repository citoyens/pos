import { commons } from "app/i18n/types";
import { Reason, SetShiftPayload, ToPay } from "core/shifts/entities/Shift";
import { ShiftModal } from "utils/modal";
import { object, string } from "yup";

export interface BaseDialogProps extends ShiftModal {
  onSuccess: () => void;
}

export interface FormState extends SetShiftPayload {}

export const handleValidations = object({
  reason: string().required(commons.REQUIRED_FIELD),
  toPay: string().required(commons.REQUIRED_FIELD),
  opsManager: string().required(commons.REQUIRED_FIELD),
});

export const defaultFormState: FormState = {
  id: "",
  toPay: ToPay.NO,
  opsManager: "",
  reason: Reason.BACKLOG_TASKS,
  extraHourReport: [],
};
