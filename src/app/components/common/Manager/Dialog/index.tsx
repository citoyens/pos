import { Close } from "@mui/icons-material";
import {
  Breakpoint,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
  title: string;
  onClose: () => void;
  content: React.ReactElement;
  size?: Breakpoint;
  open?: boolean;
  isLoading?: boolean;
}

export const ManagerDialog = (props: Props) => {
  const { onClose, title, content, size, open, isLoading } = props;
  const { t } = useTranslation();

  return (
    <Dialog
      open={open ?? true}
      onClose={onClose}
      maxWidth={size ?? "sm"}
      fullWidth
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {t(title)}

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ px: 3 }}>
        {isLoading && <LinearProgress />}
        {!isLoading && <>{content}</>}
      </DialogContent>
    </Dialog>
  );
};
