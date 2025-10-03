import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

interface Item {
  id: string;
  name: string;
}
interface Props {
  items: Item[];
  activeIndex: number;
  onItemClick: (item: Item) => void;
  hasScrolled: boolean;
}

export default function ListMenuBar({
  items,
  activeIndex,
  onItemClick,
  hasScrolled,
}: Props) {
  const theme = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  const onWheel = (e: WheelEvent) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const delta = (e as any).deltaY + (e as any).deltaX;
    if (Math.abs(delta) > 0) {
      e.preventDefault();
      el.scrollLeft += delta;
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel as any, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as any);
  }, []);

  useEffect(() => {
    if (!scrollRef.current || !hasScrolled) return;
    const el = scrollRef.current;
    const active = el.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`);
    if (!active) return;
    const aRect = active.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    if (aRect.left < eRect.left) {
      el.scrollTo({
        left: el.scrollLeft + (aRect.left - eRect.left) - 16,
        behavior: "smooth",
      });
    } else if (aRect.right > eRect.right) {
      el.scrollTo({
        left: el.scrollLeft + (aRect.right - eRect.right) + 16,
        behavior: "smooth",
      });
    }
  }, [activeIndex, hasScrolled]);

  return (
    <Box
      ref={scrollRef}
      sx={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        overflowX: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        width: "100%",
      }}
    >
      {items.map((it, idx) => (
        <Typography
          onClick={() => onItemClick(it)}
          sx={{
            whiteSpace: "nowrap",
            fontSize: 14,
            fontWeight: idx === activeIndex && hasScrolled ? 600 : 500,
            color:
              idx === activeIndex && hasScrolled
                ? "primary.main"
                : "text.primary",
            borderBottom:
              idx === activeIndex && hasScrolled
                ? `1px solid ${theme.palette.primary.main}`
                : "1px solid transparent",
            pt: 1,
            pl: 1,
            transition: "all 0.2s ease",
            "&:hover": { color: "primary.main" },
            marginRight: "12px",
          }}
        >
          {it.name}
        </Typography>
      ))}
    </Box>
  );
}
