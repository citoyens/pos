import { Autocomplete, Chip, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  label: string;
  items: string[];
  setItems: (items: string[]) => void;
  endAdornment?: React.ReactElement;
}

export const MultipleFieldWithChips = (props: Props) => {
  const { label, items, setItems, endAdornment } = props;
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState<string>("");

  const handleDelete = (chipToDelete: string) => () => {
    const tmpItems = items.filter((chip) => chip !== chipToDelete);
    setItems(tmpItems);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (["Space", "Enter"].includes(event.code)) {
      event.preventDefault();
      const value = inputValue.trim();
      if (value) {
        setItems(Array.from(new Set([...items, value])));
        setInputValue("");
      }
    }
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      disableClearable
      options={[]}
      value={items}
      onChange={(_, newValue) => {
        const tmpItems = (newValue as string[]).map((el) => el.trim());
        setItems(Array.from(new Set(tmpItems)));
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue: string) => {
        setInputValue(newInputValue);
      }}
      renderTags={(value, getTagProps) => {
        const values = value as unknown as string[];
        return values.map((option: string, index: number) => (
          <Chip
            variant="outlined"
            label={option}
            {...getTagProps({ index })}
            onDelete={handleDelete(option)}
          />
        ));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder={t(label)}
          onKeyDown={handleKeyDown}
        />
      )}
      forcePopupIcon={!!endAdornment}
      popupIcon={endAdornment}
    />
  );
};
