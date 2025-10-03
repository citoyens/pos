// src/app/components/MenuView/CategorySections.tsx
import { forwardRef } from "react";
import { Grid, Typography } from "@mui/material";
import ProductCard from "./ProductCard";

interface Category {
  id: string;
  name: string;
  children?: Record<string, any>;
  priority?: number;
}

interface Props {
  categories: Category[];
  formatPrice: (n: number) => string;
  getImage: (img: any) => string;
  onOpenModal: (product: any, sku: string) => void;
  onAdd: (product: any, sku: string) => void;
}

const CategorySections = forwardRef<HTMLDivElement, Props>(
  function CategorySections(
    { categories, formatPrice, getImage, onOpenModal, onAdd },
    ref
  ) {
    return (
      <div ref={ref}>
        <Grid container spacing={0}>
          {categories.map((category) => {
            const products = Object.entries(category.children || {})
              .map(([sku, product]: [string, any]) => ({ sku, ...product }))
              .sort((a: any, b: any) => (a.priority || 0) - (b.priority || 0));

            return (
              <Grid item xs={12} key={category.id} id={category.id}>
                <Typography
                  fontWeight={600}
                  sx={{ fontSize: "1.5rem", mb: 2, mt: 2 }}
                >
                  {category.name}
                </Typography>
                <Grid container spacing={3}>
                  {products.map((product: any) => {
                    const priceStr = formatPrice(product.price);
                    const img = getImage(product.image);
                    const openInfo = () => onOpenModal(product, product.sku);
                    const addAction = () => onAdd(product, product.sku);
                    return (
                      <Grid item xs={12} sm={6} key={product.sku}>
                        <ProductCard
                          image={img}
                          name={product.name}
                          description={product.description}
                          price={priceStr}
                          notAvailable={product.available === false}
                          onOpenInfo={openInfo}
                          onAdd={addAction}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
);

export default CategorySections;
