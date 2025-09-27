import { useState } from "react";
import { AnyObjectSchema, ValidationError } from "yup";

export interface UseModal {
  validator: (handleValidations: AnyObjectSchema, formState: object) => void;
  errors: Record<string, boolean>;
}

export const useModal = (): UseModal => {
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const validator = (handleValidations: AnyObjectSchema, formState: object) => {
    setErrors({});
    handleValidations
      .validate({ ...formState }, { abortEarly: false })
      .catch((error: ValidationError) => {
        let modifiedErrors: Record<string, boolean> = {};
        error.inner.forEach((errorDetail) => {
          if (errorDetail.path) modifiedErrors[errorDetail.path] = true;
        });
        setErrors(modifiedErrors);
      });
  };

  return {
    validator,
    errors,
  };
};
