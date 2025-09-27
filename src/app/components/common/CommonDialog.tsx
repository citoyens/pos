import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { commons } from "app/i18n/types";
import parse from "html-react-parser";
import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";

export interface CommonDialogContent {
  title: string;
  message: string;
  icon: React.ReactElement;
  handleConfirm?: () => void;
  showCancelButton?: boolean;
}

interface CommonDialogProps {
  open: boolean;
  title: string;
  message?: string;
  icon?: JSX.Element;
  bodyElement?: JSX.Element;
  showCancelButton?: boolean;
  handleConfirm: () => void;
  handleClose: () => void;
  isLoading?: boolean;
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
}

const CommonDialog: FunctionComponent<CommonDialogProps> = (props) => {
  const {
    open,
    message,
    handleConfirm: handleConfirmParam,
    handleClose,
    title,
    icon,
    showCancelButton,
    isLoading,
    bodyElement,
    cancelButtonLabel,
    confirmButtonLabel,
  } = props;

  const { t } = useTranslation();

  const [disabledConfirmButton, setDisabledConfirmButton] =
    useState<boolean>(false);

  const handleConfirm = async () => {
    setDisabledConfirmButton(true);
    await handleConfirmParam();
    setDisabledConfirmButton(false);
  };

  return (
    <Dialog
      disableEscapeKeyDown={true}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        sx={{ p: 3 }}
        id="authorization-dialog-title"
        color="primary.dark"
        variant="h5"
        fontWeight={600}
      >
        <Box display="flex" gap={1} alignItems="center">
          {icon}
          {title}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 0 }}>
        {message && (
          <DialogContentText id="alert-dialog-description" color="text.primary">
            {parse(message)}
          </DialogContentText>
        )}
        {bodyElement && <>{bodyElement}</>}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        {showCancelButton && (
          <Button
            onClick={handleClose}
            variant="outlined"
            color="error"
            startIcon={<CloseOutlinedIcon />}
            sx={{ py: 1, px: 2, fontWeight: "600", borderRadius: 5 }}
          >
            {cancelButtonLabel ?? t(commons.CANCEL)}
          </Button>
        )}
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          startIcon={
            isLoading ? <CircularProgress size={20} /> : <ArrowForwardIosIcon />
          }
          autoFocus
          sx={{ py: 1, px: 2, fontWeight: "600", borderRadius: 5 }}
          disabled={!!isLoading || disabledConfirmButton}
        >
          {confirmButtonLabel ?? t(commons.CONTINUE)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommonDialog;
