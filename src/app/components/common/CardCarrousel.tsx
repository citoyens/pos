import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Button, Grid, Paper } from "@mui/material";
import React, { FunctionComponent, useCallback, useRef } from "react";

interface CardCarrouselProps {
  content: React.ReactElement;
}

const CardCarrousel: FunctionComponent<CardCarrouselProps> = (props) => {
  const { content } = props;

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback((offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: offset,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <Box position="relative" display="flex" alignItems="center">
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          height: "85%",
        }}
      >
        <Button
          color="primary"
          onClick={() => handleScroll(-232)}
          sx={{ height: "-webkit-fill-available", minWidth: "100%" }}
        >
          <ChevronLeft />
        </Button>
      </Paper>
      <Grid container sx={{ px: 6 }}>
        <Grid
          item
          xs={12}
          ref={scrollRef}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            overflowX: "auto",
            pb: 1,
            gap: 1,
          }}
        >
          {content}
        </Grid>
      </Grid>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          right: 0,
          height: "85%",
        }}
      >
        <Button
          color="primary"
          onClick={() => handleScroll(232)}
          sx={{ height: "-webkit-fill-available", minWidth: "100%" }}
        >
          <ChevronRight />
        </Button>
      </Paper>
    </Box>
  );
};

export default CardCarrousel;
