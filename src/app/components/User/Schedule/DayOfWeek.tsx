import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateToCalendar, UserScheduleUtil } from "utils/userSchedule";
import UserScheduleSlotContent from "./SlotContent";
import {
  UserLite,
  UserScheduleConfig,
  UserScheduleDTO,
} from "core/users/entities/User";
import { UserRepo } from "core/users/repository/userRepo";

interface Props {
  datesOfWeek: string[];
  date: DateToCalendar;
  usersByKitchen: UserLite[];
  locationId: string;
  scheduleConfig?: UserScheduleConfig;
  onlyView?: boolean;
}

const UserScheduleDayOfWeek = (props: Props): React.ReactElement => {
  const {
    date,
    locationId,
    usersByKitchen,
    scheduleConfig,
    onlyView,
    datesOfWeek,
  } = props;

  const { t } = useTranslation();

  const [kitchenId, setKitchenId] = useState<string>();
  const { dayLabel, dayNumber, isToday, str } = date;

  const [dateStr, setDateStr] = useState<string>();
  const [schedules, setSchedules] = useState<UserScheduleDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setKitchenId(locationId);
  }, [locationId]);

  useEffect(() => {
    setDateStr(str);
  }, [str]);

  const getData = (dateStr: string, kitchenId: string) => {
    setLoading(true);
    setSchedules([]);
    UserRepo.findSchedulesByLocationAndDate(kitchenId, dateStr)
      .then((result) => {
        setSchedules(result);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!dateStr) return;
    if (!kitchenId) return;
    getData(dateStr, kitchenId);
  }, [dateStr, kitchenId]);

  return (
    <Box sx={UserScheduleUtil.column}>
      <Box sx={UserScheduleUtil.slotDayOfWeek}>
        <Typography
          variant="h6"
          sx={{ color: isToday ? "#3C81DB" : "#121F56" }}
        >
          {t(`common.${dayLabel}`)}
        </Typography>
        {isToday ? (
          <Chip
            label={dayNumber}
            sx={{
              backgroundColor: "#3C81DB",
              color: "white",
              fontWeight: "bold",
            }}
          />
        ) : (
          <Typography variant="h6" sx={{ color: "#121F56" }}>
            {dayNumber}
          </Typography>
        )}
      </Box>
      {usersByKitchen.map((user) => (
        <UserScheduleSlotContent
          key={`UserScheduleSlotContent${dateStr}${user}`}
          datesOfWeek={datesOfWeek}
          date={date}
          locationId={locationId}
          schedules={schedules}
          scheduleConfig={scheduleConfig}
          user={user}
          loading={loading}
          onlyView={onlyView}
        />
      ))}
    </Box>
  );
};

export default UserScheduleDayOfWeek;
