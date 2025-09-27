import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { commons } from "app/i18n/types";
import React from "react";
import { useTranslation } from "react-i18next";
import { monthOfYear } from "utils/general";
import { UserScheduleUtil } from "utils/userSchedule";

interface Props {
  startPlus: number;
  setStartPlus: (startPlus: number) => void;
}

const UserScheduleNavigation = (props: Props): React.ReactElement => {
  const { startPlus, setStartPlus } = props;

  const { t } = useTranslation();

  const dates = UserScheduleUtil.getDatesToCalendar(startPlus, true);

  const startDay = dates.at(0)?.dayNumber ?? 1;
  const startMonth = dates.at(0)?.monthNumber ?? 0;
  const endDay = dates.at(dates.length - 1)?.dayNumber ?? 1;
  const endMonth = dates.at(dates.length - 1)?.monthNumber ?? 0;

  const isSameMonth = startMonth === endMonth;
  const startMonthLbl = isSameMonth
    ? ""
    : ` ${t(`common.${monthOfYear.at(startMonth)}`)}`;
  const endMonthLbl = t(`common.${monthOfYear.at(endMonth)}`);

  const label = `${startDay}${startMonthLbl} ${t(
    commons.TO_THE
  )} ${endDay} ${endMonthLbl}`;

  return (
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
      <Button
        variant={startPlus ? "outlined" : "contained"}
        startIcon={<EventOutlinedIcon />}
        onClick={() => setStartPlus(0)}
      >
        {t(commons.TODAY)}
      </Button>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          variant="text"
          sx={{ px: 0 }}
          onClick={() => setStartPlus(startPlus - UserScheduleUtil.datePlus)}
        >
          <ArrowBackIosOutlinedIcon />
        </Button>
        <Box sx={{ display: "flex" }}>
          <Typography variant="h6">{label}</Typography>
        </Box>
        <Button
          variant="text"
          sx={{ px: 0 }}
          onClick={() => setStartPlus(startPlus + UserScheduleUtil.datePlus)}
        >
          <ArrowForwardIosOutlinedIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default UserScheduleNavigation;
