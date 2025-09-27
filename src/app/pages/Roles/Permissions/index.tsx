import { KOSPageBox } from "@foodology-co/alejandria";
import { commons, permissionsByRole } from "app/i18n/types";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "app/components/PageHeader";
import { useRole } from "app/hooks/useRole";
import { Box, Button, Stack, Switch } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { MenuService } from "core/Menu/repository/menuRepo";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import CalendarViewMonthOutlinedIcon from "@mui/icons-material/CalendarViewMonthOutlined";
import ViewComfyOutlinedIcon from "@mui/icons-material/ViewComfyOutlined";
import PermissionsSelectTable from "app/components/Role/Permission/Table2";
import { useAlert } from "app/hooks/useAlert";
import { useAppSelector } from "app/hooks/useAppSelector";
import { MenuUtils, PermissionTable } from "utils/menu";
import PermissionsTable from "app/components/Role/Permission/Table1";

interface Props {
  roleId: string;
}

const PermissionsByRolePage: FunctionComponent<Props> = (props) => {
  const { roleId } = props;
  const { t } = useTranslation();

  const alert = useAlert();
  const session = useAppSelector((state) => state.session.data);
  const [loadingMenu, setLoadingMenu] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>();
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  const [menus, setMenus] = useState<PermissionTable[]>([]);

  const role = useRole();
  const isSuperUser = role.isSuperUser();

  useEffect(() => {
    setSelectedRole(roleId);
  }, [roleId]);

  const getPermissionsByRole = useCallback(() => {
    if (!selectedRole || !session) {
      setMenus([]);
      return;
    }
    setLoadingMenu(true);
    MenuService.byRole(selectedRole)
      .then((response) =>
        setMenus(
          MenuUtils.forTable(response, selectedRole, session.companyId, [])
        )
      )
      .catch(() => setMenus([]))
      .finally(() => {
        setLoadingMenu(false);
      });
  }, [selectedRole, session]);

  const save = useCallback(() => {
    if (!menus.length) return;
    if (!session) return;
    if (!selectedRole) return;
    setLoadingSave(true);
    MenuService.saveByRolePermissions(menus)
      .then((response) => {
        if (response) {
          alert.success();
        } else {
          alert.error();
        }
      })
      .catch(() => {
        alert.error();
      })
      .finally(() => {
        setLoadingSave(false);
      });
  }, [selectedRole, menus, session]);

  useEffect(() => {
    getPermissionsByRole();
  }, [getPermissionsByRole]);

  return (
    <KOSPageBox>
      <PageHeader
        title={permissionsByRole.TITLE}
        hideNavBar
        centerArea={
          <Box sx={{ display: "flex", flexDirection: "row-reverse", gap: 1 }}>
            {isSuperUser && (
              <Button
                variant="contained"
                size="small"
                onClick={save}
                startIcon={<SaveOutlinedIcon />}
                disabled={!menus.length || loadingSave}
              >
                {t(commons.SAVE)}
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              onClick={getPermissionsByRole}
              startIcon={<RestartAltOutlinedIcon />}
              disabled={!selectedRole || loadingMenu}
            >
              {t(commons.UPDATE)}
            </Button>
            <Stack direction="row" spacing={0} sx={{ alignItems: "center" }}>
              <CalendarViewMonthOutlinedIcon />
              <Switch
                checked={view}
                onChange={(event) => setView(event.target.checked)}
                inputProps={{ "aria-label": "ant design" }}
              />
              <ViewComfyOutlinedIcon />
            </Stack>
          </Box>
        }
      />

      {!view && (
        <PermissionsTable
          menus={menus}
          setMenus={setMenus}
          loadingMenu={loadingMenu}
        />
      )}
      {view && (
        <PermissionsSelectTable
          menus={menus}
          setMenus={setMenus}
          loadingMenu={loadingMenu}
        />
      )}
    </KOSPageBox>
  );
};

export default PermissionsByRolePage;
