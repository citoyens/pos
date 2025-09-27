import React from "react";
import Box from "@mui/material/Box";
import UserScheduleDayOfWeek from "./DayOfWeek";
import UserScheduleSlotLabel from "./SlotLabel";
import { UserScheduleUtil } from "utils/userSchedule";
import { UserLite, UserScheduleConfig } from "core/users/entities/User";
import { KOSEmptyState } from "@foodology-co/alejandria";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "react-i18next";
import { commons } from "app/i18n/types";

export interface ShowPlanDetail {
  planId: number;
}

interface Props {
  startPlus: number;
  locationId: string;
  usersByKitchen: UserLite[];
  scheduleConfig?: UserScheduleConfig;
  onlyView?: boolean;
}

const UserScheduleCalendar = (props: Props): React.ReactElement => {
  const { startPlus, locationId, usersByKitchen, scheduleConfig, onlyView } = props;

  const { t } = useTranslation();

  const dates = UserScheduleUtil.getDatesToCalendar(startPlus, true);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", overflowX: "auto" }}>
        <UserScheduleSlotLabel usersByKitchen={usersByKitchen} />
        {dates.map((date, index) => (
          <UserScheduleDayOfWeek
            key={`UserScheduleDayOfWeek${index}`}
            datesOfWeek={dates.map((el) => el.str)}
            date={date}
            locationId={locationId}
            scheduleConfig={scheduleConfig}
            usersByKitchen={usersByKitchen}
            onlyView={onlyView}
          />
        ))}
      </Box>
      {!usersByKitchen.length && (
        <KOSEmptyState
          icon={InfoOutlinedIcon}
          message={t(commons.TABLE_EMPTY)}
        />
      )}
    </Box>
  );
};

export default UserScheduleCalendar;
