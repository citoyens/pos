import React from "react";
import { Radio } from "@mui/material";
import { ModifiersState } from "../types";

type Props = {
  value: ModifiersState;
  setValue: React.Dispatch<React.SetStateAction<ModifiersState>>;
  parent: string;
  id: string;
  name: string;
  price: number;
  disabled?: boolean;
};

const QuantityRadio: React.FC<Props> = ({
  value,
  setValue,
  parent,
  id,
  name,
  price,
  disabled,
}) => {
  const qty = value[parent]?.[id]?.quantity ?? 0;
  const checked = qty === 1;

  const select = () => {
    if (disabled) return;
    setValue((prev) => ({
      ...prev,
      [parent]: {
        [id]: { quantity: 1, name, price },
      },
    }));
  };

  return <Radio checked={checked} onChange={select} disabled={disabled} />;
};

export default QuantityRadio;
