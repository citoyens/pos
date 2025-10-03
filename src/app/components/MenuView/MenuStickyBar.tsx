// src/app/components/MenuView/MenuStickyBar.tsx
import Box from "@mui/material/Box";
import ListMenuBar from "./ListMenuBar";

interface Item {
  id: string;
  name: string;
}
interface Props {
  top: number;
  left: number;
  width: number;
  items: Item[];
  activeIndex: number;
  onItemClick: (item: Item) => void;
  hasScrolled: boolean;
}

export default function MenuStickyBar({
  top,
  left,
  width,
  items,
  activeIndex,
  onItemClick,
  hasScrolled,
}: Props) {
  if (width <= 0) return null;
  return (
    <Box
      sx={{
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        zIndex: 10,
        bgcolor: "background.paper",
        py: 1,
        display: "flex",
        gap: 2,
        overflowX: "auto",
        "&::-webkit-scrollbar": { display: "none" },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
        boxShadow: hasScrolled ? 1 : 0,
      }}
    >
      <ListMenuBar
        items={items}
        activeIndex={activeIndex}
        onItemClick={onItemClick}
        hasScrolled={hasScrolled}
      />
    </Box>
  );
}
