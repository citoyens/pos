import {
  Grid,
  TextField,
  LinearProgress,
  Switch,
  FormControl,
  FormLabel,
} from "@mui/material";
import { ManagerDialogFooter } from "app/components/common/Manager/Dialog/Footer";
import { useAlert } from "app/hooks/useAlert";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Actions, handleModalIcon } from "utils/modal";
import { commons, permissionsByRole } from "app/i18n/types";
import { useAppSelector } from "app/hooks/useAppSelector";
import { useModal } from "app/hooks/useModal";
import { BaseDialogProps } from "./utils";
import { handleValidations } from "./utils";
import { Role } from "core/Roles/entities/Role";
import { RoleRepo } from "core/Roles/repository/roleRepo";

interface Props extends BaseDialogProps {
  item?: Role;
}

export const HandleRoleForm = (props: Props) => {
  const { item: initialValues, onClose, onSuccess, action } = props;
  const { t } = useTranslation();
  const alert = useAlert();
  const modal = useModal();

  const companyId = useAppSelector((s) => s.session.data?.companyId) || "";

  const [name, setName] = useState<string>("");
  const [fullAccess, setFullAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setName(initialValues?.name?.trim() ?? "");
    setFullAccess(initialValues?.fullAccess ?? false);
  }, [initialValues?.id]);

  const isEdit = action === Actions.edit;

  useEffect(() => {
    modal.validator(handleValidations, {
      name: name.trim(),
    });
  }, [name]);

  const handleSubmit = useCallback(async () => {
    const safeName = name.trim();
    if (!safeName) return;

    setIsLoading(true);

    RoleRepo.upsert({
      id: initialValues?.id,
      name: safeName,
      fullAccess,
      status: initialValues?.status ?? "ACTIVE",
      companyId,
    })
      .then((response) => {
        if (!response) {
          alert.error();
          return;
        }
        alert.success();
        onSuccess();
        onClose();
      })
      .catch(() => {
        alert.error();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    name,
    fullAccess,
    isEdit,
    initialValues,
    companyId,
    alert,
    onSuccess,
    onClose,
    t,
  ]);

  return (
    <Grid container spacing={3}>
      {isLoading && (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      )}

      <Grid item xs={12} md={8}>
        <TextField
          fullWidth
          label={t(commons.NAME)}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => setName(e.target.value.trim())}
          autoFocus
          InputProps={{ endAdornment: handleModalIcon(!!modal.errors["name"]) }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <FormControl component="fieldset">
          <FormLabel>{t(permissionsByRole.FULL_ACCESS)}</FormLabel>
          <Switch
            checked={fullAccess}
            onChange={(event) => setFullAccess(event.target.checked)}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <ManagerDialogFooter
          onCancel={props.onClose}
          mainButton={{
            children: t(commons.SAVE),
            onClick: handleSubmit,
            disabled: isLoading || !name || !!Object.keys(modal.errors).length,
          }}
        />
      </Grid>
    </Grid>
  );
};
