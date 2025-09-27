import { useState, useEffect, useCallback } from "react";
import {
  Grid,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "app/hooks/useAppSelector";
import { useModal } from "app/hooks/useModal";
import { useAlert } from "app/hooks/useAlert";
import { getUnprocessed, setShift } from "core/shifts/repository/shiftRepo";
import { ManagerDialogFooter } from "app/components/common/Manager/Dialog/Footer";
import {
  BaseDialogProps,
  defaultFormState,
  FormState,
  handleValidations,
} from "./utils";
import { Actions, handleModalIcon } from "utils/modal";
import { commons, shiftManager } from "app/i18n/types";
import {
  HourType,
  hourTypeLabelsES,
  Reason,
  Shift,
  ToPay,
} from "core/shifts/entities/Shift";
import { ExtraHoursTable } from "./extraHoursTable";
import { formatDate } from "utils/date";
import { AddExtraHourModal } from "./extraHourModal";
import { useRole } from "app/hooks/useRole";
interface Props extends BaseDialogProps {
  item: Shift;
}

export const HandleShiftForm = (props: Props) => {
  const { item, onClose, onSuccess, action } = props;
  const { t } = useTranslation();
  const modal = useModal();
  const alert = useAlert();
  const user = useAppSelector((state) => state.session);
  const role = useRole();
  const isSuperUser = role.isSuperUser();
  const canApprove = role.canApproveOvertime();
  const country =
    useAppSelector((state) => state.session.user.data?.profile.country) ??
    "COL";

  const toFormState = (): FormState =>
    action === Actions.edit
      ? {
          id: item.id ?? "",
          opsManager: user.user.data?.profile.name ?? "",
          toPay: item?.toPay ?? ToPay.NO,
          reason: Reason.BACKLOG_TASKS,
          extraHourReport:
            item?.hourReport
              ?.filter((hour) => hour.isExtra)
              .flatMap((hour) =>
                Array.from({ length: hour.total }, () => ({
                  type: hour.type,
                  total: 1,
                  typeCode: hour.typeCode,
                  isExtra: true,
                  toPay: false,
                  additional: false,
                }))
              ) ?? [],
        }
      : { ...defaultFormState };

  const [formState, setFormState] = useState<FormState>(() => toFormState());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setFormState(() => toFormState());
  }, [item]);

  useEffect(() => {
    modal.validator(handleValidations, { ...formState });
  }, [formState]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddExtraHour = (type: HourType, toPay: boolean) => {
    const newHour = {
      type: hourTypeLabelsES[type],
      total: 1,
      typeCode: type,
      isExtra: true,
      toPay,
      additional: true,
    };

    setFormState((prev) => ({
      ...prev,
      toPay: ToPay.YES,
      extraHourReport: [...prev.extraHourReport, newHour],
    }));
  };

  const handleRemoveExtraHour = (index: number) => {
    setFormState((prev) => {
      const updatedHours = prev.extraHourReport.filter(
        (_, i) => i !== index || prev.extraHourReport[i].additional === false
      );
      const anySelected = updatedHours.some((hour) => hour.toPay);
      return {
        ...prev,
        extraHourReport: updatedHours,
        toPay: anySelected ? ToPay.YES : ToPay.NO,
      };
    });
  };

  const handleToggleToPay = (index: number) => {
    setFormState((prev) => {
      const updatedHours = [...prev.extraHourReport];
      updatedHours[index].toPay = !updatedHours[index].toPay;
      const anySelected = updatedHours.some((hour) => hour.toPay);
      return {
        ...prev,
        extraHourReport: updatedHours,
        toPay: anySelected ? ToPay.YES : ToPay.NO,
      };
    });
  };

  const handleSelectChange = (field: keyof Shift, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
      extraHourReport: prev.extraHourReport.map((hour) => ({
        ...hour,
        toPay: value === ToPay.YES,
      })),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = useCallback(() => {
    if (!handleValidations.isValidSync(formState)) {
      return;
    }

    setIsLoading(true);
    if (action === Actions.edit) {
      setShift(formState)
        .then(() => {
          alert.success();
          getUnprocessed(country, isSuperUser);
          onSuccess();
          onClose();
        })
        .catch(() => alert.error())
        .finally(() => setIsLoading(false));
    }
  }, [formState]);

  return (
    <Grid container spacing={3}>
      {isLoading && (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      )}

      {action === Actions.edit && item && (
        <>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <TextField
                name="opsManager"
                label={t(shiftManager.OPS_MANAGER)}
                disabled
                value={formState.opsManager}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: handleModalIcon(modal.errors["opsManager"]),
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={5}>
            <FormControl fullWidth>
              <InputLabel>{t(shiftManager.REASON)}</InputLabel>
              <Select
                label={t(shiftManager.REASON)}
                value={formState.reason ?? ""}
                onChange={(event) =>
                  handleSelectChange("reason", event.target.value)
                }
                endAdornment={handleModalIcon(modal.errors["reason"])}
              >
                {Object.values(Reason).map((key) => (
                  <MenuItem key={key} value={key}>
                    {t(`shiftManager.${key}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel>{t(shiftManager.TO_PAY)}</InputLabel>
              <Select
                label={t(shiftManager.TO_PAY)}
                value={formState.toPay ?? ""}
                onChange={(event) => {
                  const newValue = event.target.value as ToPay;
                  handleSelectChange("toPay", newValue);
                }}
                endAdornment={handleModalIcon(modal.errors["toPay"])}
                autoComplete="off"
              >
                {Object.values(ToPay)
                  .sort((a, b) =>
                    t(`commons.${a}`).localeCompare(t(`commons.${b}`))
                  )
                  .map((key) => (
                    <MenuItem key={key} value={key}>
                      {t(`commons.${key}`)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <ExtraHoursTable
              extraHourReport={formState.extraHourReport}
              onToggleToPay={handleToggleToPay}
              onRemoveExtraHour={handleRemoveExtraHour}
              action={action}
            />
          </Grid>
          <Grid container justifyContent="flex-end" item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
            >
              {t(shiftManager.ADD_EXTRA_HOUR)}
            </Button>
          </Grid>
          <AddExtraHourModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onAdd={handleAddExtraHour}
          />
        </>
      )}

      {action === Actions.view && item && (
        <>
          {item.hourReport && item.hourReport.length > 0 && (
            <Grid item xs={12}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="h6" gutterBottom>
                    {t(shiftManager.HOURS_REPORT)}:
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ textAlign: "right" }}
                  >
                    {item.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ textAlign: "right" }}
                  >
                    {t(`shiftManager.${item.workingDay}`)}
                  </Typography>
                </Grid>
              </Grid>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {t(commons.TYPE)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {t(shiftManager.CODE)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                      {t(shiftManager.TOTAL)}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item.hourReport.map((hour, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{ color: hour.isExtra ? "orange" : "inherit" }}
                      >
                        {hour.type}
                      </TableCell>
                      <TableCell>
                        {t(`shiftManager.${hour.typeCode}`)}
                      </TableCell>
                      <TableCell align="center">{hour.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          )}
          <Grid
            container
            spacing={2}
            style={{ padding: "30px", justifyItems: "center" }}
          >
            <Grid item xs={3}>
              <Typography variant="h6" gutterBottom>
                {t(shiftManager.START_TIME)}
              </Typography>
              <Typography variant="body1">
                {formatDate(item.startTime?.toString() ?? "", "UTC")}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" gutterBottom>
                {t(shiftManager.END_TIME)}
              </Typography>
              <Typography variant="body1">
                {formatDate(item.endTime?.toString() ?? "", "UTC")}
              </Typography>
            </Grid>
            <Grid item xs={3} style={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                {t(shiftManager.HOURS_IN_KITCHEN)}
              </Typography>
              <Typography variant="body1">{item.hours}</Typography>
            </Grid>
            <Grid item xs={3} style={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                {t(shiftManager.EXTRA_HOURS)}
              </Typography>
              <Typography variant="body1">{item.totalExtras}</Typography>
            </Grid>
          </Grid>
        </>
      )}

      {action === Actions.summary && item.extraHourReport && (
        <Grid item xs={12}>
          <ExtraHoursTable
            extraHourReport={item.extraHourReport}
            onToggleToPay={handleToggleToPay}
            onRemoveExtraHour={handleRemoveExtraHour}
            action={action}
          />
        </Grid>
      )}

      {canApprove && action === Actions.edit && (
        <Grid item xs={12}>
          <ManagerDialogFooter
            onCancel={onClose}
            mainButton={{
              children: t(commons.SAVE),
              onClick: handleSubmit,
              disabled: isLoading || !!Object.keys(modal.errors).length,
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};
