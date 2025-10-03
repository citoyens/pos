import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import { ProductModalProps, ModifiersState } from "./types";
import {
  buildGroups,
  areAllModifiersSelected,
  isAdjustmentNeeded,
  calculateTypographyMessage,
} from "./helpers";

import ProductImage from "./ProductImage";
import ProductHeader from "./ProductHeader";
import StickyMissingBar from "./StickyMissingBar";
import OptionRow from "./OptionRow";
import FooterAddButton from "./FooterAddButton";
import { Delete } from "@mui/icons-material";

const ProductModal: React.FC<ProductModalProps> = ({
  selectItem,
  onClose,
  onConfirm,
}) => {
  const groups = useMemo(() => buildGroups(selectItem.modifiers), [selectItem]);
  const [modifiers, setModifiers] = useState<ModifiersState>({});
  const [comment, setComment] = useState<string>(selectItem.comment ?? "");
  const [error, setError] = useState<Record<string, string>>({});

  const totalsByGroup = useMemo(() => {
    return Object.entries(modifiers).reduce<Record<string, number>>(
      (acc, [g, items]) => {
        acc[g] = Object.values(items).reduce(
          (s: number, it: any) => s + (it.quantity ?? 0),
          0
        );
        return acc;
      },
      {}
    );
  }, [modifiers]);

  const priorityValidator = areAllModifiersSelected(groups, modifiers);
  const adjustmentNeeded = isAdjustmentNeeded(groups, modifiers);

  const isDesktop =
    typeof window !== "undefined" ? window.innerWidth >= 900 : true;

  const confirm = () => {
    const missing: Record<string, string> = {};
    groups.forEach((g) => {
      const total = totalsByGroup[g.name] ?? 0;
      if (total < g.min) missing[g.name] = `Selecciona al menos ${g.min}`;
      else if (total > g.max) missing[g.name] = `Selecciona máximo ${g.max}`;
    });
    setError(missing);
    if (Object.keys(missing).length > 0) return;

    onConfirm({ sku: selectItem.idItem, quantity: 1, modifiers, comment });
  };

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const el = scrollContainerRef.current;
    if (el) el.scrollLeft += e.deltaY + e.deltaX;
  };

  return (
    <Box
      tabIndex={0}
      sx={{
        position: "relative",
        bgcolor: "background.paper",
        p: 1.5,
        width: { xs: "100%", md: "100%" },
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Botón cerrar (desktop) */}
      {isDesktop && (
        <CloseOutlinedIcon
          onClick={onClose}
          sx={{ cursor: "pointer", position: "absolute", top: 10, right: 10 }}
        />
      )}

      {/* Layout dos columnas */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: "100%",
          gap: { xs: 1.5, md: 1.5 },
        }}
      >
        <ProductImage src={selectItem.image} alt={selectItem.title} />

        {/* Columna derecha */}
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            height: "100%",
            display: "flex",
            flexDirection: "column",
            pr: 0.5,
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          <ProductHeader
            title={selectItem.name || selectItem.title}
            description={selectItem.description}
            price={selectItem.price}
            isDesktop={isDesktop}
            onClose={onClose}
          />

          {/* Contenido scrollable */}
          <Box sx={{ flex: 1, overflowY: "auto", pb: "72px" }}>
            <StickyMissingBar
              visible={adjustmentNeeded}
              message={calculateTypographyMessage(modifiers, groups)}
              onWheel={handleWheel}
            />

            {groups.map((g, idx) => {
              const isRadio = g.max < 2;
              return (
                <Box key={`${g.name}-${idx}`}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Typography
                      sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}
                    >
                      {g.name}
                    </Typography>
                    {isRadio && modifiers[g.name] && (
                      <Button
                        size="small"
                        variant="text"
                        sx={{ minWidth: 0, px: 0.5 }}
                        onClick={() =>
                          setModifiers((prev) => {
                            const { [g.name]: _, ...rest } = prev;
                            return rest;
                          })
                        }
                      >
                        <Delete fontSize="small" />
                        Borrar selección
                      </Button>
                    )}
                  </Box>

                  {g.min > 0 && (
                    <Typography
                      variant="body2"
                      sx={{ mb: 0.75, color: "text.secondary" }}
                    >
                      {g.min !== g.max
                        ? `Elige mínimo ${g.min}, máximo ${g.max}`
                        : `Elige ${g.min}`}
                    </Typography>
                  )}

                  <FormControl
                    error={Boolean(error[g.name])}
                    sx={{ width: "100%", pl: "1.2em", m: 0 }}
                  >
                    <RadioGroup value={isRadio} sx={{ m: 0 }}>
                      {g.options.map((opt) => (
                        <OptionRow
                          key={opt.key}
                          isRadio={isRadio}
                          option={opt}
                          groupName={g.name}
                          groupMax={g.max}
                          modifiers={modifiers}
                          setModifiers={setModifiers}
                          totals={totalsByGroup}
                        />
                      ))}
                    </RadioGroup>
                    <FormHelperText sx={{ mt: 0.25 }}>
                      {error[g.name]}
                    </FormHelperText>
                  </FormControl>
                </Box>
              );
            })}

            <TextField
              placeholder="Agrega los comentarios del cliente..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              sx={{ mt: 1 }}
            />
          </Box>

          <FooterAddButton disabled={!priorityValidator} onClick={confirm} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProductModal;
