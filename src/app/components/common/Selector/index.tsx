import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  options: string[];
  optionPrefix?: string;
  label: string;
  selected: string | undefined;
  setSelected: (selected?: string) => void;
  disabled?: boolean;
  endAdornment?: JSX.Element;
  multiple?: boolean;
  size?: "medium" | "small";
  fullWidth?: boolean;
}

const CustomSelector: FunctionComponent<Props> = (props) => {
  const {
    options,
    label,
    selected,
    setSelected,
    disabled,
    optionPrefix,
    endAdornment,
    multiple,
    size,
    fullWidth,
  } = props;

  const { t } = useTranslation();
  const [reset, setReset] = useState<number>(new Date().getTime());

  useEffect(() => {
    if (!selected) {
      setReset(new Date().getTime());
    }
  }, [selected]);

  return (
    <Autocomplete
      key={reset}
      size={size ?? "medium"}
      fullWidth={fullWidth}
      multiple={!!multiple}
      limitTags={multiple ? 2 : undefined}
      renderInput={(params) => (
        <TextField {...params} label={t(label)} sx={{ bgcolor: "white" }} />
      )}
      value={multiple ? selected?.split("|") ?? [] : selected}
      options={options ?? []}
      getOptionLabel={(option) =>
        t(optionPrefix && option ? `${optionPrefix}.${option}` : option)
      }
      onChange={(_, value) => {
        if (typeof value === "string") {
          setSelected(value);
          return;
        }
        if (value?.length) {
          setSelected(value.join("|"));
          return;
        }
        setSelected(undefined);
      }}
      forcePopupIcon={!!endAdornment}
      popupIcon={endAdornment}
      disabled={disabled}
    />
  );
};

export default CustomSelector;
