import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import appConfig from "config/app";
import React from "react";

interface Props {
  onClose: () => void;
  title: string;
}

const CommonAppBar = (props: Props): React.ReactElement => {
  const { onClose, title } = props;

  const isProduction = appConfig.env === "production";
  return (
    <AppBar
      position="fixed"
      color={!isProduction ? "secondary" : "primary"}
      sx={{ zIndex: 15 }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            gap: 1,
            textTransform: "uppercase",
          }}
        >
          <IconButton
            color="primary"
            onClick={onClose}
            aria-label="close"
            sx={{ color: "white" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color: "white" }}>
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton
            color="primary"
            onClick={onClose}
            aria-label="close"
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CommonAppBar;
