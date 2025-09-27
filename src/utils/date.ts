export const formatDate = (date: string, timeZone: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: timeZone,
  };

  return new Date(date).toLocaleString("en-US", options);
};
