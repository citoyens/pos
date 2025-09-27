import { ManagerDialog } from "app/components/common/Manager/Dialog";
import { useTranslation } from "react-i18next";
import { getDialogTitle } from "utils/modal";
import { BaseDialogProps } from "./utils";
import { HandleShiftForm } from "./form";
import { Shift } from "core/shifts/entities/Shift";

const ShiftManagerDialog = (props: BaseDialogProps) => {
  const { onClose, action, item } = props;
  const { t } = useTranslation();
  const dialogTitle = getDialogTitle(t, undefined, action);

  return (
    <>
      {item && (
        <ManagerDialog
          title={dialogTitle}
          onClose={onClose}
          size="md"
          content={<HandleShiftForm {...props} item={item as Shift} />}
        />
      )}
    </>
  );
};

export default ShiftManagerDialog;
