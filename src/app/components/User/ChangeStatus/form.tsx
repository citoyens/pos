import { Grid, TextField, LinearProgress } from "@mui/material";
import { ManagerDialogFooter } from "app/components/common/Manager/Dialog/Footer";
import { useAlert } from "app/hooks/useAlert";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BaseDialogProps,
  handleEndValidations,
  handleStartValidations,
} from "./utils";
import { UserRepo } from "core/users/repository/userRepo";
import { handleModalIcon } from "utils/modal";
import { User, Status, UserChangeStatus } from "core/users/entities/User";
import { useModal } from "app/hooks/useModal";
import { commons } from "app/i18n/types";
import CustomSelector from "app/components/common/Selector";
import { getRetirementReasons, getRetirementTypes } from "utils/retirement";

interface Props extends BaseDialogProps {
  item: User;
}

export const HandleUserForm = (props: Props) => {
  const { item, onClose, onSuccess } = props;
  const { t } = useTranslation();
  const modal = useModal();
  const alert = useAlert();
  const types = getRetirementTypes();
  const currentDate = new Date().toISOString().split("T")[0];

  const handleValidations =
    item.status === Status.ACTIVE
      ? handleEndValidations
      : handleStartValidations;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startOrEndDate, setStartOrEndDate] = useState<string>(currentDate);
  const [endType, setEndType] = useState<string>();
  const [reasons, setReasons] = useState<string[]>([]);
  const [endReason, setEndReason] = useState<string>();

  useEffect(() => {
    setReasons([]);
    setEndReason(undefined);
    if (!endType) return;
    setReasons(getRetirementReasons(endType));
  }, [endType]);

  useEffect(() => {
    modal.validator(handleValidations, {
      startOrEndDate,
      endType,
      endReason,
    });
  }, [startOrEndDate, endType, endReason]);

  const handleSubmit = useCallback(() => {
    if (
      !handleValidations.isValidSync({
        startOrEndDate,
        endType,
        endReason,
      })
    ) {
      return;
    }

    setIsLoading(true);

    const payload: UserChangeStatus = {
      id: item.id,
      status: item.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE,
      startOrEndDate,
      endType: endType ?? "",
      endReason: endReason ?? "",
    };

    UserRepo.changeStatus(payload)
      .then(() => {
        alert.success();
        onSuccess();
        onClose();
      })
      .catch((error) => {
        console.error("Error userChangeStatus", error);
        alert.error();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [startOrEndDate, endType, endReason]);

  return (
    <Grid container spacing={3}>
      {isLoading && (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t(
            item.status === Status.ACTIVE
              ? commons.END_DATE
              : commons.START_DATE
          )}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: handleModalIcon(modal.errors["startOrEndDate"]),
          }}
          value={startOrEndDate}
          onChange={(e) => {
            const newDate = e.target.value;
            setStartOrEndDate(newDate);
          }}
        />
      </Grid>
      {item.status === Status.ACTIVE && (
        <>
          <Grid item xs={12}>
            <CustomSelector
              label={t(commons.RETIREMENT_TYPE)}
              options={types}
              selected={endType}
              setSelected={setEndType}
              optionPrefix="retirementTypeLocale"
              endAdornment={handleModalIcon(modal.errors["endType"])}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomSelector
              label={t(commons.RETIREMENT_REASON)}
              options={reasons}
              selected={endReason}
              optionPrefix="retirementReasonLocale"
              setSelected={setEndReason}
              endAdornment={handleModalIcon(modal.errors["endReason"])}
            />
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <ManagerDialogFooter
          onCancel={props.onClose}
          mainButton={{
            children: t(commons.SAVE),
            onClick: handleSubmit,
            disabled: isLoading || !!Object.keys(modal.errors).length,
          }}
        />
      </Grid>
    </Grid>
  );
};
