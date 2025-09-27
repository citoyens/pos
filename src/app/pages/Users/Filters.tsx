import { FunctionComponent, useEffect, useState } from "react";
import SearchOnTopBar from "app/components/common/SearchOnTopBar";
import { Status, User } from "core/users/entities/User";
import { compareSearchText } from "utils/general";
import { Grid, Paper, Typography } from "@mui/material";
import { commons } from "app/i18n/types";
import { useTranslation } from "react-i18next";
import KitchenSelector from "app/components/Kitchen/Selector";
import CustomSelector from "app/components/common/Selector";
import { isCorporate } from "utils/areaAndPosition";

interface Props {
  users: User[];
  loading?: boolean;
  setFilteredStores: (users: User[]) => void;
}

const UserFilter: FunctionComponent<Props> = (props) => {
  const { users, setFilteredStores, loading } = props;

  const { t } = useTranslation();

  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedKitchen, setSelectedKitchen] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [selectedCorporate, setSelectedCorporate] = useState<string>();

  const [search, setSearch] = useState<string>("");

  const countryValidator = (user: User, selected?: string): boolean => {
    if (!selected) return true;
    return user.country === selected;
  };

  const cityValidator = (user: User, selected?: string): boolean => {
    if (!selected) return true;
    return user.city === selected;
  };

  const kitchenValidator = (user: User, selected?: string): boolean => {
    if (!selected) return true;
    return user.profile.kitchenId === selected;
  };

  const statusValidator = (user: User, selected?: string): boolean => {
    if (!selected) return true;
    return user.status === selected;
  };

  const corporateValidator = (user: User, selected?: string): boolean => {
    if (!selected) return true;
    const validator = isCorporate(user.contract?.area ?? "");
    return selected === "YES" ? validator : !validator;
  };

  const searchValidator = (user: User, toSearch: string): boolean => {
    if (!toSearch) return true;
    return (
      compareSearchText(`${user.firstname} ${user.lastname}`, toSearch) ||
      compareSearchText(user.email, toSearch) ||
      compareSearchText(user.username, toSearch)
    );
  };

  useEffect(() => {
    setFilteredStores(
      users.filter((user) => {
        return (
          statusValidator(user, selectedStatus) &&
          corporateValidator(user, selectedCorporate) &&
          countryValidator(user, selectedCountry) &&
          cityValidator(user, selectedCity) &&
          kitchenValidator(user, selectedKitchen) &&
          searchValidator(user, search)
        );
      })
    );
  }, [
    users,
    selectedCountry,
    selectedCity,
    selectedKitchen,
    search,
    selectedStatus,
    selectedCorporate,
  ]);

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t(commons.FILTERS)}
          </Typography>

          <SearchOnTopBar onSearch={setSearch} />

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <KitchenSelector
                selected={{
                  country: selectedCountry,
                  city: selectedCity,
                  kitchen: selectedKitchen,
                }}
                onChange={{
                  country: (value) => setSelectedCountry(value?.code ?? ""),
                  city: (value) => setSelectedCity(value?.code ?? ""),
                  kitchen: (value) =>
                    setSelectedKitchen(value?.kitchenId ?? ""),
                }}
                extra={{
                  disabled: loading,
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomSelector
                label={t(commons.STATUS)}
                selected={selectedStatus}
                setSelected={setSelectedStatus}
                options={Object.keys(Status)}
                optionPrefix="commons"
              />
            </Grid>
            <Grid item xs={2}>
              <CustomSelector
                label={t(commons.CORPORATE)}
                selected={selectedCorporate}
                setSelected={setSelectedCorporate}
                options={["YES", "NO"]}
                optionPrefix="commons"
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default UserFilter;
