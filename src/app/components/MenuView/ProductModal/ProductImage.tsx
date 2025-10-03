import React from "react";
import { Box } from "@mui/material";

const ProductImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <Box
    sx={{
      width: { xs: "100%", md: "40%" },
      height: { xs: 220, md: "100%" },
      borderRadius: "8px",
      overflow: "hidden",
      flexShrink: 0,
    }}
  >
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
  </Box>
);

export default ProductImage;
