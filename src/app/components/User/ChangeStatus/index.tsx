import { ManagerDialog } from "app/components/common/Manager/Dialog";
import { useTranslation } from "react-i18next";
import { getDialogTitle } from "utils/modal";
import { BaseDialogProps } from "./utils";
import { HandleUserForm } from "./form";
import { User } from "core/users/entities/User";

const UserChangeStatusDialog = (props: BaseDialogProps) => {
  const { onClose, action, item } = props;

  const { t } = useTranslation();
  const dialogTitle = getDialogTitle(t, undefined, action);

  return (
    <ManagerDialog
      title={dialogTitle}
      onClose={onClose}
      size="sm"
      content={<HandleUserForm {...props} item={item as User} />}
    />
  );
};

export default UserChangeStatusDialog;
