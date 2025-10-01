import { FunctionComponent } from "react";
import { Card, CardActionArea, Typography, Avatar } from "@mui/material";
import { Store } from "core/stores/entities/Store";
import { Brand } from "core/brands/entities/Brand";

interface StoreWithBrand extends Store {
  fullBrand?: Brand;
}

interface BrandCardProps {
  store: StoreWithBrand;
  onSelect: (store: StoreWithBrand) => void;
}

export const BrandCard: FunctionComponent<BrandCardProps> = ({
  store,
  onSelect,
}) => {
  return (
    <Card
      sx={{
        width: 140,
        height: 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "0.2s",
        "&:hover": {
          boxShadow: 4,
          transform: "scale(1.05)",
        },
      }}
    >
      <CardActionArea
        onClick={() => onSelect(store)}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Avatar
          src={store.fullBrand?.logoUrl}
          alt={store.fullBrand?.name || store.brand?.name}
          sx={{
            width: 80,
            height: 80,
            mb: 1,
            bgcolor: "grey.200",
          }}
        >
          {(store.fullBrand?.name || store.brand?.name)?.charAt(0)}
        </Avatar>
        <Typography variant="caption" align="center" sx={{ fontWeight: 500 }}>
          {store.fullBrand?.name || store.brand?.name}
        </Typography>
      </CardActionArea>
    </Card>
  );
};
