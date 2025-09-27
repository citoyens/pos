import {
  KOSBaseTable,
  KOSBaseTableHeader,
  KOSRowData,
  KOSSelectedResult,
} from "@foodology-co/alejandria";
import Box from "@mui/material/Box";
import ChecklistIcon from "@mui/icons-material/Checklist";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FunctionComponent, useCallback } from "react";
import { Actions, ShiftModal } from "utils/modal";
import { IconButton } from "@mui/material";
import { commons, shiftManager } from "app/i18n/types";
import { Shift } from "core/shifts/entities/Shift";
import { formatDate } from "utils/date";
import { useRole } from "app/hooks/useRole";
import { useTranslation } from "react-i18next";

interface Props {
  filteredShifts: Shift[];
  loading: boolean;
  selectedItems: KOSSelectedResult[];
  setSelectedItems: (selectedItems: KOSSelectedResult[]) => void;
  setModal: (modal: ShiftModal) => void;
  refreshData: () => void;
}

const ShiftTable: FunctionComponent<Props> = (props) => {
  const { filteredShifts, loading, setModal } = props;
  const { t } = useTranslation();

  const role = useRole();
  const canApprove = role.canApproveOvertime();

  const getActions = useCallback(
    (row: KOSRowData) => ({
      value: (
        <>
          {canApprove && (
            <IconButton
              color="warning"
              onClick={() =>
                setModal({
                  open: true,
                  item: row as Shift,
                  action: Actions.edit,
                  onClose: () => {},
                })
              }
            >
              <ChecklistIcon />
            </IconButton>
          )}
          <IconButton
            color="primary"
            onClick={() =>
              setModal({
                open: true,
                item: row as Shift,
                action: Actions.view,
                onClose: () => {},
              })
            }
          >
            <VisibilityIcon />
          </IconButton>
        </>
      ),
    }),
    [canApprove]
  );

  const getHeader = useCallback((): KOSBaseTableHeader[] => {
    return [
      {
        label: t(commons.ACTION),
        align: "center",
        render: getActions,
      },
      {
        label: t(shiftManager.IDENTIFICATION),
        field: "identification",
      },
      {
        label: t(commons.COUNTRY),
        field: "country",
      },
      {
        label: t(commons.CITY),
        field: "city",
      },
      {
        label: t(commons.KITCHEN),
        field: "kitchenId",
      },
      {
        label: t(commons.NAME),
        field: "name",
      },
      {
        label: t(shiftManager.SHIFT_TYPE),
        render: (row) => ({
          value: t(row.workingDay ? `shiftManager.${row.workingDay}` : ` `),
        }),
      },
      {
        label: t(commons.POSITION),
        field: "position",
      },
      {
        label: t(shiftManager.START_TIME),
        render: (row) => ({ value: formatDate(row.startTime, "UTC") }),
      },
      {
        label: t(shiftManager.END_TIME),
        render: (row) => ({ value: formatDate(row.endTime, "UTC") }),
      },
      {
        label: t(shiftManager.EXTRA_HOURS),
        field: "totalExtras",
      },
      {
        label: t(shiftManager.HOURS_IN_KITCHEN),
        field: "hours",
      },
      {
        label: t(shiftManager.CLOSED_BY_SYSTEM),
        weight: (row) => (row.closedBySystem ? "bold" : "normal"),
        color: (row) => (row.closedBySystem ? "red" : "inherit"),
        align: "center",
        sort: true,
        render: (row) => ({
          value: t(row.closedBySystem ? commons.YES : commons.NO),
        }),
      },
    ];
  }, [canApprove]);

  return (
    <Box mt={2}>
      <KOSBaseTable
        columns={getHeader()}
        pagination={{ enable: true }}
        rows={{
          data: filteredShifts,
          total: filteredShifts.length,
          loading: !!loading,
        }}
        fixedColumns={1}
      />
    </Box>
  );
};

export default ShiftTable;
