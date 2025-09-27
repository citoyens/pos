import {
  Alert,
  Backdrop,
  CircularProgress,
  Divider,
  Slide,
  StepConnector,
  StepIconProps,
  Switch,
  SwitchProps,
  SxProps,
  TableCell,
  TableRow,
  stepConnectorClasses,
  styled,
  tableCellClasses,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Theme } from "@mui/system";
import React from "react";

export const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

export const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundColor: theme.palette.primary.main,
  }),
}));

export interface IconsList {
  [index: string]: React.ReactElement;
}

interface CustomStepIconProps extends StepIconProps {
  icons: IconsList;
}

export const CustomStepIcon = (props: CustomStepIconProps) => {
  const { active, completed, className, icons } = props;

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
};

export const CustomTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const CustomTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface AlertDefaultProps {
  message: string;
}

export const AlertDefault = (props: AlertDefaultProps) => {
  const { message } = props;
  return (
    <Alert
      sx={{ backgroundColor: "#F1EFEF", color: "#7B7B7B" }}
      variant="outlined"
      severity="info"
    >
      {message}
    </Alert>
  );
};

export const sxModalIcon = {
  height: "80px",
  width: "80px",
  paddingRight: "5px",
};

export type ColorType =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

export const menuPaperProps = {
  elevation: 0,
  sx: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};

export const DividerMenu = (): React.ReactElement => {
  return (
    <Divider variant="fullWidth" sx={{ borderColor: "#F1EFEF", my: 0.5 }} />
  );
};

export const sxCustomBlue = {
  backgroundColor: "#3C81DB",
  color: "white",
  "&:hover": {
    backgroundColor: "#3C81DB",
    color: "white",
  },
};

export const sxCustomWhite = {
  backgroundColor: "#FEFBFB",
  color: "#3C81DB",
  borderBottom: "#3C81DB solid",
  "&:hover": {
    backgroundColor: "#FEFBFB",
    color: "#3C81DB",
  },
};

export const iconButtonStyle: SxProps<Theme> = {
  margin: "6px",
  border: "1px solid",
  borderRadius: "8px",
  borderColor: "#FFF",
  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25), 0px 0px 1px rgba(0, 0, 0, 0.25)",
};

export const centerBoxElements = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const print80mm = {
  "@page": {
    size: "portrait",
  },
  display: "none",
  displayPrint: "block",
  width: "80mm",
  height: "auto",
  padding: "4mm",
  pt: "10mm",
  pb: "20mm",
};

export const fabStyle = {
  position: "absolute",
  bottom: 16,
  right: 16,
};

export const DividerPrint = (): React.ReactElement => {
  return <Divider sx={{ my: 1, borderStyle: "dashed", borderWidth: 2 }} />;
};

export const BackdropLoading = ({ open }: { open: boolean }) => {
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export const TransitionDialogUp = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#65C466",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#2ECA45",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));
