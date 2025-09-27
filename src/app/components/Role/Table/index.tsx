import {
  KOSBaseTable,
  KOSBaseTableHeader,
  KOSRowData,
} from "@foodology-co/alejandria";
import Box from "@mui/material/Box";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { FunctionComponent, useCallback } from "react";
import { IconButton } from "@mui/material";
import { commons, permissionsByRole } from "app/i18n/types";
import { Actions } from "utils/modal";
import { Role } from "core/Roles/entities/Role";
import { useTranslation } from "react-i18next";

interface Props {
  filteredRoles: Role[];
  loading: boolean;
  setModal: (modal?: {
    open: boolean;
    item?: { id: string; name: string };
    action: Actions;
    onClose: () => void;
  }) => void;
}

const RoleTable: FunctionComponent<Props> = (props) => {
  const { filteredRoles, loading, setModal } = props;
  const { t } = useTranslation();

  const getActions = useCallback(
    (row: KOSRowData) => ({
      value: (
        <>
          <IconButton
            color="warning"
            onClick={() =>
              setModal({
                open: true,
                item: { id: row["id"], name: row["name"] },
                action: Actions.edit,
                onClose: () => setModal(undefined),
              })
            }
          >
            <ModeEditOutlineOutlinedIcon />
          </IconButton>
          <IconButton
            color="info"
            onClick={() =>
              row.fullAccess
                ? () => {}
                : setModal({
                    open: true,
                    item: { id: row["id"], name: row["name"] },
                    action: Actions.changeAccess,
                    onClose: () => setModal(undefined),
                  })
            }
            disabled={row.fullAccess}
          >
            <LockOpenOutlinedIcon />
          </IconButton>
        </>
      ),
    }),
    [setModal]
  );

  const getHeader = useCallback((): KOSBaseTableHeader[] => {
    return [
      {
        label: t(commons.ACTION),
        align: "center",
        render: getActions,
      },
      {
        label: t(commons.NAME),
        field: "name",
      },
      {
        label: t(permissionsByRole.FULL_ACCESS),
        render: (row) => ({
          value: t(row.fullAccess ? commons.YES : commons.NO),
        }),
      },
    ];
  }, [getActions]);

  return (
    <Box mt={2}>
      <KOSBaseTable
        columns={getHeader()}
        pagination={{ enable: true }}
        rows={{
          data: filteredRoles,
          total: filteredRoles.length,
          loading: !!loading,
        }}
        fixedColumns={1}
      />
    </Box>
  );
};

export default RoleTable;
