import { commons, permissionsByRole } from "app/i18n/types";
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
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
import { MenuUtils, PermissionTable } from "utils/menu";

interface Props {
  menus: PermissionTable[];
  setMenus: Dispatch<SetStateAction<PermissionTable[]>>;
  loadingMenu: boolean;
}

const PermissionsSelectTable: FunctionComponent<Props> = (props) => {
  const { menus, setMenus, loadingMenu } = props;
  const { t } = useTranslation();

  const handleChange = useCallback(
    (current: PermissionTable, event: any) => {
      const {
        target: { value },
      } = event;
      const permissionsByRole =
        typeof value === "string" ? value.split(",") : value;
      setMenus((prevs) =>
        MenuUtils.modifyPermissions(prevs, current, permissionsByRole)
      );
    },
    [setMenus]
  );

  const handleDelete = useCallback(
    (current: PermissionTable, deleteItem: string, event: any) => {
      event.preventDefault();
      event.stopPropagation();
      const permissionsByRole = current.permissions.filter(
        (el) => el !== deleteItem
      );
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
        <CustomBodyCell>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="select-permissions">
              {t(permissionsByRole.PERMISSIONS)}
            </InputLabel>
            <Select
              labelId="select-permissions"
              multiple
              value={menu.permissions}
              fullWidth
              onChange={(event) => handleChange(menu, event)}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      variant="outlined"
                      onDelete={(event) => handleDelete(menu, value, event)}
                      onMouseDown={(e) => {
                        const el = e.target as HTMLElement;
                        if (el.closest(".MuiChip-deleteIcon")) {
                          e.stopPropagation();
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
            >
              {menu.defaultPermissions.map((permission) => (
                <MenuItem key={permission} value={permission}>
                  {permission}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CustomBodyCell>
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
            <CustomHeaderCell sx={{ backgroundColor: "#F9FAFC !important" }}>
              {t(commons.ACTION)}
            </CustomHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loadingMenu && <TableRowSkeleton columnsNumber={2} rowsNumber={4} />}
          {!loadingMenu && !menus.length && (
            <TableRow>
              <CustomBodyCell colSpan={2}>
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

export default PermissionsSelectTable;
