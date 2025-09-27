export interface ServiceLevelResult {
  serviceLevel: number;
  serviceLevelPercentage: string;
  color: string;
}

export const getTransferItemServiceLevel = (
  value: number | undefined | null,
  total: number
): ServiceLevelResult => {
  let color = "red";
  const serviceLevel = total > 0 ? ((value ?? 0) * 100) / total : 0;

  if (86 <= serviceLevel && serviceLevel <= 99) {
    color = "orange";
  }
  if (100 <= serviceLevel && serviceLevel <= 115) {
    color = "green";
  }
  return {
    serviceLevel,
    serviceLevelPercentage: `${serviceLevel.toFixed(0)}%`,
    color,
  };
};

export const tableHeaderSX = {
  "& > th": {
    bgcolor: "#F9FAFC",
    borderBottom: "2px solid #E3E5E8",
    color: "text.secondary",
    fontWeight: 700,
    textTransform: "uppercase",
  },
};

export const sortStringOfDate = (a: string, b: string) => {
  const aTime = new Date(a).getTime();
  const bTime = new Date(b).getTime();
  return aTime - bTime;
};

export const getDatesBetween = (
  startDateStr: string,
  endDateStr: string
): string[] => {
  const dates: string[] = [];
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  while (startDate <= endDate) {
    dates.push(startDate.toISOString().split("T")[0]);
    startDate.setDate(startDate.getDate() + 1);
  }

  return dates;
};

export const replaceLineBreak = (param: any) =>
  typeof param === "string" ? param.replace(/\n/g, "").trim() : param;

export const replaceCommasWithPeriods = (param: string) =>
  param.replace(/,/g, ".");

export const clearSpecialCharacters = (text: string): string => {
  if (typeof text !== "string") {
    console.warn("Expected string but received:", text);
    return "";
  }
  const result = text
    .replace(/(.)/g, (format) => format.toUpperCase())
    // .replace(/\s/g, "-")
    .replace(/\./g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return replaceLineBreak(result);
};

export const roundNumber = (num?: number | null): number => {
  if (!num) {
    return 0;
  }

  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const s3Url = "https://images-kos.s3.amazonaws.com/";

export const getUserImage = (userId?: string) => {
  return `${s3Url}users/${userId}.jpg`;
};

export const stringToNumber = (value: string) => {
  const quantityTmp = Number(value);
  return !quantityTmp ? 0 : quantityTmp;
};

export const getCurrentWeekNumber = (date?: Date) => {
  const day = date ?? new Date();
  day.setHours(0, 0, 0, 0);
  day.setDate(day.getDate() + 4 - (day.getDay() || 7));
  const dateInMilliseconds = day.getTime();
  const year = day.getFullYear();
  const startOfYearInMilliseconds = new Date(year, 0, 1).getTime();
  return Math.ceil(
    ((dateInMilliseconds - startOfYearInMilliseconds) / 8.64e7 + 1) / 7
  );
};

export const slugsForKitchenSelector = [":kitchenId", ":cpId", ":locationId"];

export const dayOfTheWeek = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export const monthOfYear = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

export const openUrl = (url: string) => {
  if (!url) return;
  window.open(url, "_blank");
};

export const compareSearchText = (
  word: string | number | null,
  search: string
): boolean => {
  const toSearch = clearSpecialCharacters(search.toLowerCase());
  const wordClear = clearSpecialCharacters(
    (word ?? "").toString().toLowerCase()
  );
  const arrayToSearch = toSearch.split(" ");
  return arrayToSearch.every((el) =>
    el.trim() ? wordClear.includes(el) : true
  );
};

export interface SelectedString {
  value?: string;
  onChange: (value?: string) => void;
}
