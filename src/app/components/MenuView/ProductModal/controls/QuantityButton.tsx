import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ModifiersState } from "../types";

type Props = {
  value: ModifiersState;
  setValue: React.Dispatch<React.SetStateAction<ModifiersState>>;
  parent: string;
  id: string;
  name: string;
  price: number;
  disabled?: boolean;
  maxQuantity: number;
  totalQuantity: Record<string, number>;
};

const QuantityButton: React.FC<Props> = ({
  value,
  setValue,
  parent,
  id,
  name,
  price,
  disabled,
  maxQuantity,
  totalQuantity,
}) => {
  const qty = value[parent]?.[id]?.quantity ?? 0;
  const catTotal = totalQuantity[parent] || 0;
  const canInc = !disabled && catTotal < maxQuantity;

  const dec = () => {
    if (disabled) return;
    setValue((prev) => {
      const current = prev[parent]?.[id]?.quantity ?? 0;
      if (current === 0) return prev;
      return {
        ...prev,
        [parent]: {
          ...(prev[parent] ?? {}),
          [id]: {
            ...(prev[parent]?.[id] ?? {}),
            quantity: current - 1,
            name,
            price,
          },
        },
      };
    });
  };

  const inc = () => {
    if (!canInc) return;
    setValue((prev) => {
      const current = prev[parent]?.[id]?.quantity ?? 0;
      return {
        ...prev,
        [parent]: {
          ...(prev[parent] ?? {}),
          [id]: { quantity: current + 1, name, price },
        },
      };
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        minWidth: "4rem",
        border: "1px solid #A5A8AC",
        borderRadius: "8px",
        height: "30px",
        mr: "10px",
        m: 0.2,
      }}
    >
      <IconButton size="small" onClick={dec} disabled={disabled}>
        –
      </IconButton>
      <Typography sx={{ mx: 0.5 }}>{qty}</Typography>
      <IconButton size="small" onClick={inc} disabled={!canInc}>
        +
      </IconButton>
    </Box>
  );
};

export default QuantityButton;
