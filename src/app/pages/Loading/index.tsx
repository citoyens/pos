import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { commons } from "app/i18n/types";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

interface LoadingPageProps {}

const LoadingPage: FunctionComponent<LoadingPageProps> = () => {
  const { t } = useTranslation();

  return (
    <Box
      height="calc(100vh - 56px)"
      overflow="auto"
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      gap={1}
      flexWrap={{ xs: "nowrap", md: "wrap" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
        sx={{ gap: 2 }}
      >
        <CircularProgress />
        <Typography variant="h3">{t(commons.LOADING)}...</Typography>
      </Box>
    </Box>
  );
};

export default LoadingPage;
