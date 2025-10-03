import React from "react";
import { Box, Button } from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

type Props = {
  disabled: boolean;
  onClick: () => void;
};

const FooterAddButton: React.FC<Props> = ({ disabled, onClick }) => (
  <Box
    sx={{
      position: "sticky",
      bottom: 0,
      left: 0,
      right: 0,
      py: 1,
      px: 0,
      bgcolor: "background.paper",
      mx: 0,
    }}
  >
    <Button
      fullWidth
      variant="contained"
      disabled={disabled}
      onClick={onClick}
      startIcon={<CheckCircleOutlineOutlinedIcon />}
      sx={{
        height: 44,
        borderRadius: 2,
        textTransform: "none",
        boxShadow: "none",
        bgcolor: "primary.main",
        "&:hover": { bgcolor: "primary.dark" },
      }}
    >
      Agregar
    </Button>
  </Box>
);

export default FooterAddButton;
