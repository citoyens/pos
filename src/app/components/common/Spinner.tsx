import CircularProgress from "@mui/material/CircularProgress";
import { SxProps, Theme } from "@mui/system";
import React from "react";

interface SpinnerProps {
  sx?: SxProps<Theme>;
}

const Spinner = (props: SpinnerProps): React.ReactElement => {
  const { sx } = props;
  return <CircularProgress sx={sx} />;
};

Spinner.defaultProps = {
  sx: {},
};

export default Spinner;
