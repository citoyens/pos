import React, { useCallback, useEffect, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { centerBoxElements } from "utils/generalUI";
import { DateToCalendar, UserScheduleUtil } from "utils/userSchedule";
import {
  UserLite,
  UserSchedule,
  UserScheduleConfig,
  UserScheduleDTO,
} from "core/users/entities/User";
import { shiftManager } from "app/i18n/types";
import { UserRepo } from "core/users/repository/userRepo";
import { useAlert } from "app/hooks/useAlert";

interface Props {
  date: DateToCalendar;
  schedules: UserScheduleDTO[];
  user: UserLite;
  locationId: string;
  loading: boolean;
  datesOfWeek: string[];
  scheduleConfig?: UserScheduleConfig;
  onlyView?: boolean;
}

const UserScheduleSlotContent = (props: Props): React.ReactElement => {
  const {
    date,
    user,
    schedules: schedulesOfDay,
    loading,
    locationId,
    scheduleConfig,
    datesOfWeek,
  } = props;

  const { t } = useTranslation();
  const alert = useAlert();

  const { isBefore: disabledAction, str: dateStr } = date;
  const [schedule, setSchedule] = useState<UserScheduleDTO>();
  const [schedules, setSchedules] = useState<UserSchedule[]>([]);
  const [kitchenId, setKitchenId] = useState<string>();

  useEffect(() => {
    setKitchenId(locationId);
  }, [locationId]);

  useEffect(() => {
    const types = ["ALL", user.workingDay];
    setSchedules(
      scheduleConfig?.definedSchedules.filter((el) =>
        types.includes(el.type)
      ) ?? []
    );
  }, [scheduleConfig?.definedSchedules]);

  useEffect(() => {
    setSchedule(schedulesOfDay.filter((el) => el.userId === user._id).at(0));
  }, [schedulesOfDay]);

  const handleChange = useCallback(
    (value: UserSchedule | null) => {
      if (!kitchenId) return;
      if (!datesOfWeek.length) return;
      const newValue = value
        ? {
            _id: "",
            userId: user._id,
            userDocument: user.username,
            userName: user.name,
            locationId: kitchenId ?? "",
            date: dateStr,
            schedule: value,
          }
        : undefined;
      setSchedule(newValue);
      if (!newValue) return;
      UserRepo.upsertSchedule({
        ...newValue,
        locationId: kitchenId,
        datesOfWeek,
      }).then((response) => {
        if (response.message !== "SUCCESSFUL_PROCESS") {
          alert.warningWithMsg({
            title: t(`alertMessage.${response.message}`),
          });
        }
      });
    },
    [kitchenId, datesOfWeek]
  );

  return (
    <>
      <Box sx={UserScheduleUtil.slotBox}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            background: "#f9fafc",
            overflowY: "auto",
            ...centerBoxElements,
          }}
        >
          {loading && <CircularProgress />}
          {!loading && (
            <Autocomplete
              getOptionLabel={(option) => option.name}
              options={schedules}
              value={schedule?.schedule ?? null}
              onChange={(_: any, newValue: UserSchedule | null) =>
                handleChange(newValue)
              }
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label={t(shiftManager.SHIFT_TYPE)} />
              )}
              disabled={!schedules.length || disabledAction}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default UserScheduleSlotContent;
