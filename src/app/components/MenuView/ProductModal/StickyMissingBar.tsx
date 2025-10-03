import React from "react";
import { Box, Typography } from "@mui/material";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

type Props = {
  visible: boolean;
  message: string;
  onWheel?: (e: React.WheelEvent<HTMLDivElement>) => void;
};

const StickyMissingBar: React.FC<Props> = ({ visible, message, onWheel }) => {
  if (!visible) return null;
  return (
    <Box
      onWheel={onWheel}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        background: "white",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "info.light",
        p: "8px",
        mb: 1,
        overflowX: "auto",
        "&::-webkit-scrollbar": { display: "none" },
        display: "flex",
      }}
    >
      <ProductionQuantityLimitsIcon sx={{ color: "info.dark", mr: 0.5 }} />
      <Typography color="info.dark" sx={{ whiteSpace: "nowrap" }}>
        Faltan: {message}
      </Typography>
    </Box>
  );
};

export default StickyMissingBar;
