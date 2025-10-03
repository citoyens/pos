import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { currency } from "./helpers";

type Props = {
  title: string;
  description?: string;
  price: number;
  isDesktop: boolean;
  onClose: () => void;
};

const ProductHeader: React.FC<Props> = ({
  title,
  description,
  price,
  isDesktop,
  onClose,
}) => (
  <Box sx={{ flexShrink: 0, pb: 1 }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "start",
        justifyContent: "space-between",
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: 24 }}>{title}</Typography>
      {!isDesktop && (
        <IconButton onClick={onClose} size="small">
          <CloseOutlinedIcon />
        </IconButton>
      )}
    </Box>

    {description && (
      <Typography sx={{ fontSize: 16, mb: 0.5 }}>{description}</Typography>
    )}

    <Typography sx={{ fontWeight: 700 }}>{currency(price)}</Typography>
  </Box>
);

export default ProductHeader;
