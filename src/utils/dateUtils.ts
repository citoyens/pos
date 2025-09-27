import { formatInTimeZone } from "date-fns-tz";

export const convertDateUtc = (date: Date, format?: string) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return formatInTimeZone(date, timeZone, format ?? "dd/MM/yyyy hh:mm:ss a");
};

export const convertDate = (stringDate: string, format?: string) => {
  const date = new Date(stringDate + "Z");
  return convertDateUtc(date, format ?? "dd/MM/yyyy hh:mm:ss a");
};

export const convertLocalDate = (
  stringDate: string,
  format: "date" | "time"
): string => {
  const date = new Date(stringDate);
  let locale = "en-GB";
  let restOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  if (format === "time") {
    locale = "en-US";
    restOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
  }
  return date.toLocaleString(locale, {
    timeZone: undefined,
    ...restOptions,
  });
};

export const convertLocalFullDate = (stringDate: string): string => {
  return `${convertLocalDate(stringDate, "date")} ${convertLocalDate(
    stringDate,
    "time"
  )}`;
};

export const getDaysOfDifference = (date1: string, date2: string) => {
  const diff = new Date(date1).getTime() - new Date(date2).getTime();
  return diff / (1000 * 60 * 60 * 24);
};

export interface Today {
  now: Date;
  start: Date;
  str: string;
}

const getDateStr = (date: Date) => {
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getToday = (): Today => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return {
    now,
    start,
    str: getDateStr(start),
  };
};

const getDateInTheInitialHours = (value?: string | Date) => {
  const type = typeof value;
  let date = new Date();
  if (type === "object") date = value as Date;
  if (type === "string") date = new Date(`${value as string} `);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const DateUtil = {
  getDateStr,
  getToday,
  getDateInTheInitialHours
}