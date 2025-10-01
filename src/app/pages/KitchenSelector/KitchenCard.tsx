import { FunctionComponent } from "react";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { KitchenSlice } from "core/kitchens/entities/Kitchen";

interface KitchenCardProps {
  kitchen: KitchenSlice;
  onSelect: (kitchenId: string) => void;
}

export const KitchenCard: FunctionComponent<KitchenCardProps> = ({
  kitchen,
  onSelect,
}) => {
  return (
    <Card
      sx={{
        boxShadow: 1,
        transition: "0.2s",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardActionArea onClick={() => onSelect(kitchen.kitchenId)}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>
            {kitchen.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {kitchen.address ?? "Sin dirección"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {kitchen.city} · {kitchen.country}
          </Typography>
          {kitchen.locationCode && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block" }}
            >
              {kitchen.locationCode}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
