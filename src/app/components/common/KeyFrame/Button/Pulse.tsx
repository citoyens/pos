import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import KeyFrames from "..";
import { colorHexToRgb } from "../util";

interface Props {
  children: React.ReactNode;
  colorHex: string;
  repeat: 1 | 2 | 3 | 4 | "infinite";
  sx?: SxProps;
  isRound?: boolean;
}

const KeyFrameButtonPulse = (props: Props) => {
  const { sx, isRound, children, colorHex, repeat } = props;
  const colorRGB = colorHexToRgb(colorHex);

  return (
    <>
      <KeyFrames
        name="pulse"
        _0={{
          width: "100%",
          height: "100%",
          border: `10px solid rgb(${colorRGB?.r} ${colorRGB?.g} ${colorRGB?.b} / 1)`,
        }}
        _50={{
          width: "125%",
          height: "125%",
          border: `10px solid rgb(${colorRGB?.r} ${colorRGB?.g} ${colorRGB?.b} / 50%)`,
        }}
        _100={{
          width: "150%",
          height: "150%",
          border: "10px solid transparent",
        }}
      />
      <Box
        sx={{
          ...sx,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "&:before": {
            content: '""',
            position: "absolute",
            borderRadius: isRound ? "100%" : undefined,
            animation: `pulse linear 2s ${repeat}`,
          },
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default KeyFrameButtonPulse;
