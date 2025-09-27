import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { commons } from "app/i18n/types";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

interface ErrorPropsPage {}

const ErrorPage: FunctionComponent<ErrorPropsPage> = () => {
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
      >
        <Typography variant="h1">{t(commons.ERROR_TITLE)}</Typography>
        <Typography>{t(commons.ERROR_SUBTITLE)}</Typography>
      </Box>
    </Box>
  );
};

export default ErrorPage;
