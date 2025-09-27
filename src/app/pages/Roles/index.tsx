import { KOSPageBox } from "@foodology-co/alejandria";
import { commons, permissionsByRole } from "app/i18n/types";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import RoleTable from "app/components/Role/Table";
import RoleFilter from "./Filters";
import PageHeader from "app/components/PageHeader";
import { useAllRoles } from "app/hooks/useAllRoles";
import { useMount } from "react-use";
import { useRole } from "app/hooks/useRole";
import RoleManagerDialog from "app/components/Role/Manager";
import {
  Actions,
  addOrEditModal,
  changeAccessModal,
  RoleModal,
} from "utils/modal";
import { Role } from "core/Roles/entities/Role";
import FullDialog from "app/components/common/FullDialog";
import PermissionsByRolePage from "./Permissions";

interface Props {}

const RolePage: FunctionComponent<Props> = () => {
  const { t } = useTranslation();

  const roles = useAllRoles();
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [modal, setModal] = useState<RoleModal>();

  const role = useRole();
  const isSuperUser = role.isSuperUser();

  const getData = () => {
    roles.get();
  };

  const onCloseModal = () => setModal(undefined);

  useMount(() => {
    getData();
  });

  return (
    <KOSPageBox>
      <PageHeader
        title={permissionsByRole.TITLE}
        rightArea={[
          {
            children: t(commons.CREATE),
            variant: "contained",
            startIcon: <AddOutlinedIcon />,
            onClick: () =>
              setModal({
                open: true,
                action: Actions.add,
                onClose: onCloseModal,
              }),
            show: isSuperUser,
          },
          {
            children: t(commons.UPDATE),
            variant: "outlined",
            startIcon: <RestartAltOutlinedIcon />,
            onClick: getData,
          },
        ]}
      />

      <RoleFilter roles={roles.list} setFilteredRoles={setFilteredRoles} />

      <RoleTable
        filteredRoles={filteredRoles}
        loading={roles.getLoading}
        setModal={setModal}
      />

      {isSuperUser && addOrEditModal(modal) && (
        <RoleManagerDialog
          {...modal}
          onClose={onCloseModal}
          onSuccess={getData}
        />
      )}
      {isSuperUser && changeAccessModal(modal) && (
        <FullDialog
          open={true}
          title={modal?.item?.name}
          onClose={onCloseModal}
          content={<PermissionsByRolePage roleId={modal?.item?.id ?? ""} />}
        />
      )}
    </KOSPageBox>
  );
};

export default RolePage;
