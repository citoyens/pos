import { ManagerDialog } from "app/components/common/Manager/Dialog";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDialogTitle, getIsLoading } from "utils/modal";
import { BaseDialogProps } from "./utils";
import { Role } from "core/Roles/entities/Role";
import { HandleRoleForm } from "./form";
import { RoleRepo } from "core/Roles/repository/roleRepo";

const RoleManagerDialog = (props: BaseDialogProps) => {
  const { onClose, action, item } = props;

  const { t } = useTranslation();
  const dialogTitle = getDialogTitle(t, undefined, action);

  const [itemId, setItemId] = useState<string>();
  const [role, setRole] = useState<Role>();

  const isLoading = getIsLoading(action, !!role);

  useEffect(() => {
    if (!item) return;
    setItemId(item["id"]);
  }, [item]);

  useEffect(() => {
    if (!itemId) return;
    RoleRepo.byId(itemId).then(setRole);
  }, [itemId]);

  return (
    <ManagerDialog
      title={dialogTitle}
      onClose={onClose}
      isLoading={isLoading}
      size="md"
      content={<HandleRoleForm {...props} item={role} />}
    />
  );
};

export default RoleManagerDialog;
