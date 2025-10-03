import React, { useCallback, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

type Props = {
  image: string;
  name: string;
  description?: string;
  price: string;
  notAvailable?: boolean;
  onAdd: () => void;
  onOpenInfo: () => void;
};

const ProductCard: React.FC<Props> = ({
  image,
  name,
  description,
  price,
  notAvailable,
  onAdd,
  onOpenInfo,
}) => {
  const [confirmDisabled] = useState(false);

  const handleCardClick = useCallback(() => {
    if (notAvailable) return;
    onAdd();
  }, [notAvailable, onAdd]);

  const handleAddClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (notAvailable) return;
      onAdd();
    },
    [notAvailable, onAdd]
  );

  return (
    <Box
      onClick={handleCardClick}
      display="flex"
      flexDirection="column"
      sx={{
        borderRadius: "8px",
        boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.24)",
        cursor: notAvailable ? "not-allowed" : "pointer",
        opacity: notAvailable ? 0.6 : 1,
        bgcolor: "background.paper",
      }}
    >
      <Box display="flex" flexDirection="row" height="100%">
        <Box
          sx={{
            width: "42%",
            position: "relative",
            filter: notAvailable ? "opacity(0.5)" : undefined,
          }}
        >
          <img
            src={image}
            alt={name}
            style={{
              height: "100%",
              borderRadius: "8px 0 0 8px",
              objectFit: "cover",
              width: "100%",
            }}
          />
        </Box>
        <Box
          sx={{
            width: "58%",
            display: "flex",
            flexDirection: "column",
            margin: "10px",
            justifyContent: "flex-start",
          }}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="8px"
            sx={{ filter: notAvailable ? "opacity(0.5)" : undefined }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "14px",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "text.primary",
              }}
            >
              {name}
            </Typography>
          </Box>
          {description ? (
            <Typography
              sx={{
                color: "grey.700",
                fontWeight: 400,
                fontSize: "12px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                mb: "16px",
                filter: notAvailable ? "opacity(0.5)" : undefined,
              }}
            >
              {description}
            </Typography>
          ) : (
            <Box sx={{ flex: 1 }} />
          )}
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            margin="12px 0 0 0"
          >
            <Typography
              sx={{
                color: "text.primary",
                fontWeight: 700,
                fontSize: "15px",
                filter: notAvailable ? "opacity(0.5)" : undefined,
              }}
            >
              {price}
            </Typography>

            <Button
              variant="contained"
              size="small"
              onClick={handleAddClick}
              disabled={!!notAvailable || confirmDisabled}
              startIcon={<ShoppingBagOutlinedIcon />}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                minWidth: 100,
                bgcolor: "info.dark",
                "&:hover": { bgcolor: "info.main" },
              }}
            >
              Agregar
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductCard;
