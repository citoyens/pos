import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Checkbox,
  Button,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { commons, shiftManager } from "app/i18n/types";
import { Hour } from "core/shifts/entities/Shift";
import { useTranslation } from "react-i18next";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Actions } from "utils/modal";

interface ExtraHoursTableProps {
  extraHourReport: Hour[];
  onToggleToPay: (index: number) => void;
  onRemoveExtraHour: (index: number) => void;
  action: Actions;
}

export const ExtraHoursTable = ({
  extraHourReport,
  onToggleToPay,
  onRemoveExtraHour,
  action,
}: ExtraHoursTableProps) => {
  const { t } = useTranslation();
  const totalExtras = extraHourReport.reduce(
    (acc, hour) => acc + hour.total,
    0
  );
  const totalApproved = extraHourReport
    .filter((hour) => hour.toPay)
    .reduce((acc, hour) => acc + hour.total, 0);
  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h6" gutterBottom>
            {t(shiftManager.EXTRA_HOURS)}
          </Typography>
        </Grid>
        <Grid item>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Typography variant="body1">
              <span style={{ fontWeight: "bold" }}>
                {t(shiftManager.TOTAL_EXTRA_HOURS)}:
              </span>{" "}
              {totalExtras}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: "bold" }}>
                {t(shiftManager.APPROVED_EXTRA_HOURS)}:
              </span>{" "}
              {totalApproved}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold", textAlign: "left", padding: "4px" }}
            >
              {t(commons.TYPE)}
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", textAlign: "left", padding: "4px" }}
            >
              {t(shiftManager.CODE)}
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", textAlign: "center", padding: "4px" }}
            >
              {t(shiftManager.PAY)}
            </TableCell>
            {action === Actions.edit && (
              <>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "4px",
                  }}
                >
                  {t(commons.DELETE)}
                </TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {extraHourReport.map((hour, index) => (
            <TableRow key={index} sx={{ minHeight: "30px" }}>
              <TableCell sx={{ textAlign: "left", padding: "4px" }}>
                {hour.type}
              </TableCell>
              <TableCell sx={{ textAlign: "left", padding: "4px" }}>
                {t(`shiftManager.${hour.typeCode}`)}
              </TableCell>
              <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                <Checkbox
                  checked={hour.toPay}
                  onChange={() => onToggleToPay(index)}
                  disabled={action === Actions.summary}
                />
              </TableCell>
              {action === Actions.edit && hour.additional && (
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  <Button onClick={() => onRemoveExtraHour(index)}>
                    <DeleteOutlineIcon />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
