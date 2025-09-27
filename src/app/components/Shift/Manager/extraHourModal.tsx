import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ManagerDialogFooter } from "app/components/common/Manager/Dialog/Footer";
import { commons, shiftManager } from "app/i18n/types";
import { useState } from "react";
import { HourType } from "core/shifts/entities/Shift";

interface AddExtraHourModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (type: HourType, toPay: boolean) => void;
}

export const AddExtraHourModal = ({
  open,
  onClose,
  onAdd,
}: AddExtraHourModalProps) => {
  const { t } = useTranslation();
  const [newHourType, setNewHourType] = useState<HourType>(
    HourType.ORDINARY_DAYTIME
  );
  const [newToPay, setNewToPay] = useState(true);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{t(shiftManager.ADD_EXTRA_HOUR)}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>{t(shiftManager.HOUR_TYPE)}</InputLabel>
          <Select
            label={t(shiftManager.HOUR_TYPE)}
            value={newHourType}
            onChange={(e) => setNewHourType(e.target.value as HourType)}
          >
            {Object.values(HourType)
              .sort((a, b) =>
                t(`shiftManager.${a}`).localeCompare(t(`shiftManager.${b}`))
              )
              .map((type) => (
                <MenuItem key={type} value={type}>
                  {t(`shiftManager.${type}`)}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <ManagerDialogFooter
          onCancel={onClose}
          mainButton={{
            children: t(commons.SAVE),
            onClick: () => {
              onAdd(newHourType, newToPay);
              onClose();
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
