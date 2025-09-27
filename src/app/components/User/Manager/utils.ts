import { commons, userManager } from "app/i18n/types";
import { User } from "core/users/entities/User";
import { t } from "i18next";
import { UserModal } from "utils/modal";
import { array, object, string } from "yup";

export interface BaseDialogProps extends UserModal {
  onSuccess: () => void;
}

export interface FormState extends Partial<User> {}

export const handleValidations = object({
  firstname: string().required(commons.REQUIRED_FIELD),
  lastname: string().required(commons.REQUIRED_FIELD),
  username: string().required(commons.REQUIRED_FIELD),
  country: string().required(commons.REQUIRED_FIELD),
  email: string().email(t(userManager.INVALID_EMAIL)).required(commons.REQUIRED_FIELD),
  genre: string().required(commons.REQUIRED_FIELD),
  phoneNumber: string().required(commons.REQUIRED_FIELD),
  documentType: string().required(commons.REQUIRED_FIELD),
  documentNumber: string().required(commons.REQUIRED_FIELD),
  birthday: string().required(commons.REQUIRED_FIELD),
  roles: array().min(1, commons.REQUIRED_FIELD),
  city: string().required(commons.REQUIRED_FIELD),

  area: string().required(commons.REQUIRED_FIELD),
  position: string().required(commons.REQUIRED_FIELD),
  contractType: string().required(commons.REQUIRED_FIELD),
  workingDay: string().required(commons.REQUIRED_FIELD),
  startDate: string().required(commons.REQUIRED_FIELD),
  startDateCurrent: string().required(commons.REQUIRED_FIELD),
});
