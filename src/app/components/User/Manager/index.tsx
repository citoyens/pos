import { ManagerDialog } from "app/components/common/Manager/Dialog";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDialogTitle, getIsLoading } from "utils/modal";
import { BaseDialogProps } from "./utils";
import { useAllUsers } from "app/hooks/useAllUsers";
import { HandleUserForm } from "./form";

const UserManagerDialog = (props: BaseDialogProps) => {
  const { onClose, action, item } = props;

  const users = useAllUsers();
  const { t } = useTranslation();
  const dialogTitle = getDialogTitle(t, undefined, action);

  const [itemId, setItemId] = useState<string | undefined>();
  const isLoading = getIsLoading(action, !!users.userById);

  useEffect(() => {
    if (!item) return;
    setItemId(item["id"]);
  }, [item]);

  useEffect(() => {
    if (!itemId) return;
    users.byId(itemId);
  }, [itemId]);

  return (
    <ManagerDialog
      title={dialogTitle}
      onClose={onClose}
      isLoading={isLoading}
      size="md"
      content={<HandleUserForm {...props} item={users.userById} />}
    />
  );
};

export default UserManagerDialog;
