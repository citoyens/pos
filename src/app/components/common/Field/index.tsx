import { TextField, TextFieldProps } from "@mui/material";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { removeLeadingZeros } from "utils/number";

export type Props = TextFieldProps & {
  onChangeInputValue?: (value: unknown) => void;
  endAdornment?: React.ReactNode;
  instantUpdate?: boolean;
  toFixedNumber?: number;
};

const CustomField = (props: Props) => {
  const {
    value,
    onChangeInputValue,
    endAdornment,
    instantUpdate,
    toFixedNumber,
    ...otherProps
  } = props;
  const InputProps = otherProps.InputProps ?? {};
  const [inputValue, setInputValue] = useState<string>();

  useDebounce(
    () => {
      onChangeInputValue?.(inputValue);
    },
    instantUpdate ? 0 : 1000,
    [inputValue]
  );

  useEffect(() => {
    let inValue = value?.toString() ?? "";
    if (otherProps.type === "number") {
      inValue = toFixedNumber
        ? Number(inValue).toFixed(toFixedNumber)
        : inValue;
    }
    setInputValue(inValue);
  }, [value]);

  return (
    <TextField
      {...otherProps}
      value={inputValue ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        setInputValue(
          otherProps.type === "number" ? removeLeadingZeros(val) : val
        );
      }}
      autoComplete="off"
      InputProps={{
        ...InputProps,
        endAdornment: endAdornment ?? InputProps?.endAdornment,
      }}
    />
  );
};

export default CustomField;
