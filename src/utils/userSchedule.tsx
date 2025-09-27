import { dayOfTheWeek } from "./general";
import { DateUtil } from "./dateUtils";

const column = { display: "flex", flexDirection: "column" };

const slotLabel = {
  width: 300,
  height: 100,
  backgroundColor: "#f9fafc",
  boxShadow: "inset -2px -2px 0px #e3e5e8",
  p: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const slotBox = {
  ...slotLabel,
  width: 252,
};

const slotCorner = {
  height: 48,
  width: 300,
  backgroundColor: "#f9fafc",
  boxShadow: "inset -2px -2px 0px #e3e5e8",
};

const slotDayOfWeek = {
  ...slotCorner,
  display: "flex",
  gap: 1,
  alignItems: "center",
  justifyContent: "center",
  width: 252,
};

const datePlus = 7;

const getDate = (
  startPlus: number,
  plus: number,
  starInMonday: boolean
): DateToCalendar => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const day = date.getDay();
  const daysToSubtract = starInMonday ? (day + 6) % 7 : 0;

  date.setDate(date.getDate() - daysToSubtract + startPlus + plus);
  const dayLabel = dayOfTheWeek.at(date.getDay()) ?? "";
  const dayNumber = date.getDate();
  const monthNumber = date.getMonth();
  const dateStr = DateUtil.getDateStr(date);

  const today = DateUtil.getToday();
  const isToday = today.str === dateStr;
  const isBefore = date.getTime() < today.start.getTime();
  const isBeforeOrToday = date.getTime() <= today.start.getTime();

  return {
    date,
    dayLabel,
    dayNumber,
    str: dateStr,
    monthNumber,
    isToday,
    isBefore,
    isBeforeOrToday,
  };
};

export interface DateToCalendar {
  date: Date;
  str: string;
  dayLabel: string;
  dayNumber: number;
  monthNumber: number;
  isToday: boolean;
  isBefore: boolean;
  isBeforeOrToday: boolean;
}

const getDatesToCalendar = (
  startPlus: number,
  startInMonday: boolean
): DateToCalendar[] => {
  const result: DateToCalendar[] = [];
  Array.from(Array(datePlus)).forEach((_, plus) =>
    result.push(getDate(startPlus, plus, startInMonday))
  );
  return result;
};

const getSlotColor = (slot: string) => {
  switch (slot) {
    default:
      return "#c6def1";
  }
};

const s3Url = "https://images-kos.s3.amazonaws.com/";

const getUserImage = (userId?: string) => {
  return `${s3Url}users/${userId}.jpg`;
};

export const UserScheduleUtil = {
  getSlotColor,
  getDatesToCalendar,
  datePlus,
  slotLabel,
  slotBox,
  slotCorner,
  slotDayOfWeek,
  column,
  s3Url,
  getUserImage,
};
