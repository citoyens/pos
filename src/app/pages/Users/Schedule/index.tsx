import React, { FunctionComponent, useEffect, useState } from "react";
import { KOSEmptyState, KOSPageBox } from "@foodology-co/alejandria";
import Grid from "@mui/material/Grid";
import PageHeader from "app/components/PageHeader/PageHeader";
import UserScheduleCalendar from "app/components/User/Schedule/Calendar";
import UserScheduleNavigation from "app/components/User/Schedule/Navigation";
import { UserLite, UserScheduleConfig } from "core/users/entities/User";
import { UserRepo } from "core/users/repository/userRepo";
import { useTranslation } from "react-i18next";
import KitchenSelector from "app/components/Kitchen/Selector";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { commons, userSchedule } from "app/i18n/types";
import { useRole } from "app/hooks/useRole";

interface Props {}

const UserSchedulePage: FunctionComponent<Props> = () => {
  const { t } = useTranslation();
  const role = useRole();
  const userLocation = role.getLocationForUserSchedule();

  const [loading, setLoading] = useState<boolean>(false);

  const [usersByKitchen, setUsersByKitchen] = useState<UserLite[]>([]);
  const [scheduleConfig, setScheduleConfig] = useState<UserScheduleConfig>();

  const [startPlus, setStartPlus] = useState<number>(0);

  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedKitchen, setSelectedKitchen] = useState<string>();

  useEffect(() => {
    if (!userLocation) return;
    setSelectedKitchen(userLocation);
  }, [userLocation]);

  useEffect(() => {
    if (!selectedCountry) {
      setScheduleConfig(undefined);
      return;
    }
    setLoading(true);
    UserRepo.findScheduleConfig(selectedCountry)
      .then(setScheduleConfig)
      .finally(() => setLoading(false));
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedKitchen) {
      setUsersByKitchen([]);
      return;
    }
    setLoading(true);
    UserRepo.byKitchen(selectedKitchen)
      .then(setUsersByKitchen)
      .finally(() => setLoading(false));
  }, [selectedKitchen]);

  return (
    <KOSPageBox>
      <PageHeader
        title={t(userSchedule.TITLE)}
        centerArea={
          <Grid container spacing={2}>
            <Grid item md={7} xs={12}>
              {!userLocation && (
                <KitchenSelector
                  selected={{
                    country: selectedCountry,
                    city: selectedCity,
                    kitchen: selectedKitchen,
                  }}
                  onChange={{
                    country: (value) => setSelectedCountry(value?.code),
                    city: (value) => setSelectedCity(value?.code),
                    kitchen: (value) => setSelectedKitchen(value?.kitchenId),
                  }}
                  extra={{
                    disabled: loading,
                    size: "small",
                  }}
                />
              )}
            </Grid>
            <Grid
              item
              md={5}
              xs={12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <UserScheduleNavigation
                startPlus={startPlus}
                setStartPlus={setStartPlus}
              />
            </Grid>
          </Grid>
        }
      />

      {!selectedKitchen && (
        <KOSEmptyState
          icon={InfoOutlinedIcon}
          message={t(commons.SELECT_LOCATIONS)}
        />
      )}
      {!!selectedKitchen && (
        <Grid container spacing={2}>
          <Grid item sm={12} xs={12}>
            <UserScheduleCalendar
              startPlus={startPlus}
              locationId={selectedKitchen}
              usersByKitchen={usersByKitchen}
              scheduleConfig={scheduleConfig}
            />
          </Grid>
        </Grid>
      )}
    </KOSPageBox>
  );
};

export default UserSchedulePage;
