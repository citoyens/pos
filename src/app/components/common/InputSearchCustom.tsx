import { TextField, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import React, { FunctionComponent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "react-use";
import { clearSpecialCharacters } from "utils/general";

interface Props {
  title?: string;
  label: string;
  search?: string;
  setSearch: (search: string) => void;
  compact?: boolean;
  fullWidth?: boolean;
}

const InputSearchCustom: FunctionComponent<Props> = (props) => {
  const { title, label, search, setSearch, compact, fullWidth } = props;

  const { t } = useTranslation();
  const [searchInput, setSearchInput] = React.useState<string>("");

  useDebounce(
    () => {
      setSearch(clearSpecialCharacters(searchInput.toLocaleLowerCase()));
    },
    1000,
    [searchInput]
  );

  useEffect(() => {
    if (search !== undefined) {
      setSearchInput(search);
    }
  }, [search]);

  return (
    <Paper sx={{ p: compact ? 0 : 2, width: fullWidth ? "100%" : "auto" }}>
      {!!title && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t(title)}
        </Typography>
      )}
      <TextField
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          mb: compact ? 0 : 0.5,
        }}
        label={t(label)}
        type="search"
        onChange={(event) => {
          setSearchInput(event.target.value);
        }}
        inputProps={{ style: { height: "100%" } }}
        value={searchInput}
        autoComplete="off"
      />
    </Paper>
  );
};

export default InputSearchCustom;
