import React from "react";
import { Box, Typography } from "@mui/material";
import QuantityButton from "./controls/QuantityButton";
import QuantityRadio from "./controls/QuantityRadio";
import { ModifiersState, Option } from "./types";
import { currency } from "./helpers";

type Props = {
  isRadio: boolean;
  option: Option;
  groupName: string;
  groupMax: number;
  modifiers: ModifiersState;
  setModifiers: React.Dispatch<React.SetStateAction<ModifiersState>>;
  totals: Record<string, number>;
};

const OptionRow: React.FC<Props> = ({
  isRadio,
  option,
  groupName,
  groupMax,
  modifiers,
  setModifiers,
  totals,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {isRadio ? (
          <QuantityRadio
            value={modifiers}
            setValue={setModifiers}
            parent={groupName}
            id={option.key}
            name={option.name}
            price={option.price}
            disabled={!option.available}
          />
        ) : (
          <QuantityButton
            value={modifiers}
            setValue={setModifiers}
            parent={groupName}
            id={option.key}
            name={option.name}
            price={option.price}
            disabled={!option.available}
            maxQuantity={groupMax}
            totalQuantity={totals}
          />
        )}

        <Typography
          sx={{
            textDecoration: option.available ? undefined : "line-through",
          }}
        >
          {option.name}
        </Typography>
      </Box>

      <Typography
        sx={{
          color: "grey.700",
          m: 0,
          fontSize: "0.9em",
          fontWeight: option.price > 0 ? 700 : 400,
        }}
      >
        {option.price > 0 ? currency(option.price) : "$0"}
      </Typography>
    </Box>
  );
};

export default OptionRow;
