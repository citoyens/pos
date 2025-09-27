import { Box, Dialog } from "@mui/material";
import React from "react";
import { TransitionDialogUp } from "utils/generalUI";
import CommonAppBar from "./AppBar";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactElement;
}

const FullDialog = (props: Props): React.ReactElement => {
  const { onClose, title, content, open } = props;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={TransitionDialogUp}
    >
      <CommonAppBar title={title} onClose={onClose} />
      <Box sx={{ mt: 8 }}>{content}</Box>
    </Dialog>
  );
};

export default FullDialog;
