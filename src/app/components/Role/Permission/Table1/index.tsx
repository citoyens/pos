import { commons } from "app/i18n/types";
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  CustomBodyCell,
  CustomHeaderCell,
  KOSEmptyState,
} from "@foodology-co/alejandria";
import TableRowSkeleton from "app/components/common/Table/RowSkeleton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { MenuUtils, PermissionTable } from "utils/menu";
import { Permission } from "core/Menu/entities/Menu";

interface Props {
  menus: PermissionTable[];
  setMenus: Dispatch<SetStateAction<PermissionTable[]>>;
  loadingMenu: boolean;
}

const PermissionsTable: FunctionComponent<Props> = (props) => {
  const { menus, setMenus, loadingMenu } = props;
  const { t } = useTranslation();
  const permissionLabels = Object.keys(Permission);

  const handleChange = useCallback(
    (current: PermissionTable, permission: string) => {
      const { permissions } = current;
      const exists = permissions.includes(permission);
      const permissionsByRole = exists
        ? permissions.filter((el) => el !== permission)
        : [...permissions, permission];
      setMenus((prevs) =>
        MenuUtils.modifyPermissions(prevs, current, permissionsByRole)
      );
    },
    [setMenus]
  );

  const Row = (menu: PermissionTable) => {
    return (
      <TableRow
        key={menu.menuId}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <CustomBodyCell scope="row">
          {MenuUtils.renderLabel(menu)}
        </CustomBodyCell>
        {permissionLabels.map((key) => {
          const enable = menu.defaultPermissions.includes(key);
          const active = menu.permissions.includes(key);
          return (
            <CustomBodyCell scope="row" align="center">
              <Button
                variant={enable ? "outlined" : "text"}
                size="small"
                color={active ? "success" : "warning"}
                onClick={() => (enable ? handleChange(menu, key) : undefined)}
                disabled={!enable}
              >
                {enable && (
                  <>
                    {active ? (
                      <CheckCircleOutlineOutlinedIcon />
                    ) : (
                      <CancelOutlinedIcon />
                    )}
                  </>
                )}
                {!enable && <BlockOutlinedIcon />}
              </Button>
            </CustomBodyCell>
          );
        })}
      </TableRow>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <CustomHeaderCell sx={{ backgroundColor: "#F9FAFC !important" }}>
              {t(commons.NAME)}
            </CustomHeaderCell>
            {permissionLabels.map((key) => (
              <CustomHeaderCell
                align="center"
                sx={{ backgroundColor: "#F9FAFC !important" }}
              >
                {key}
              </CustomHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loadingMenu && (
            <TableRowSkeleton
              columnsNumber={permissionLabels.length + 1}
              rowsNumber={4}
            />
          )}
          {!loadingMenu && !menus.length && (
            <TableRow>
              <CustomBodyCell colSpan={permissionLabels.length + 1}>
                <KOSEmptyState
                  message={t(commons.TABLE_EMPTY)}
                  icon={InfoOutlinedIcon}
                />
              </CustomBodyCell>
            </TableRow>
          )}
          {!loadingMenu && menus.map((menu) => Row(menu))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PermissionsTable;
