import { json2Csv } from "core/common/utils/fileUtils";
import { downloadTextAsCsv } from "app/utils/file";
import { commons, shiftManager } from "app/i18n/types";
import { useTranslation } from "react-i18next";
import { Hour, Shift } from "core/shifts/entities/Shift";

interface ExportCSVProps {
  selectedItemsHistorical: { id: string }[];
  historical: Shift[];
}

export const ExportCSV = ({
  selectedItemsHistorical,
  historical,
}: ExportCSVProps) => {
  const { t } = useTranslation();

  const getCSV = () => {
    const selectedShifts = selectedItemsHistorical
      .map((item) => historical.find((shift) => shift.id === item.id))
      .filter(Boolean) as Shift[];

    if (!selectedShifts.length) return;

    const headersMap: Record<string, string> = {
      year: t(commons.YEAR),
      month: t(commons.MONTH),
      day: t(commons.DAY),
      week: t(commons.WEEK),
      date: t(commons.DATE),
      opsManager: t(shiftManager.OPS_MANAGER),
      country: t(commons.COUNTRY),
      city: t(commons.CITY),
      kitchenId: t(commons.KITCHEN),
      identification: t(shiftManager.IDENTIFICATION),
      name: t(commons.NAME),
      startTime: t(shiftManager.START_TIME),
      endTime: t(shiftManager.END_TIME),
      extraHours: t(shiftManager.EXTRA_HOURS),
      reason: t(shiftManager.REASON),
      toPay: t(shiftManager.TO_PAY),
    };

    const headerMex = {
      isHoliday: t(shiftManager.HOLIDAY),
      doble: t(shiftManager.DOUBLE),
      triple: t(shiftManager.TRIPLE),
    };

    const headerCol = {
      nightHours: t(shiftManager.NIGHT_HOURS),
      dayHours: t(shiftManager.DAY_HOURS),
    };

    const formatValue = (header: string, value: any) => {
      if (["startTime", "endTime"].includes(header)) {
        return value
          ? new Date(value).toISOString().replace("T", " ").split(".")[0]
          : "";
      }
      if (header === "reason") return t(`reasons.${value}`);
      return value ?? "";
    };

    const countApprovedOvertime = (
      extraHours: Hour[] | undefined | null
    ): number => (extraHours ?? []).filter((hour) => hour.toPay).length;

    const data = selectedShifts.map((shift) => {
      const headers =
        shift.country === "MEX"
          ? { ...headersMap, ...headerMex }
          : shift.country === "COL"
          ? { ...headersMap, ...headerCol }
          : headersMap;

      const totalApproved = (shift.extraHourReport ?? []).filter(
        (hour) => hour.toPay
      ).length;
      const doble = Math.min(totalApproved, 3);
      const triple = Math.max(totalApproved - 3, 0);

      let nightHours = 0;
      let dayHours = 0;
      if (shift.extraHourReport && shift.country === "COL") {
        shift.extraHourReport.forEach((hour) => {
          if (hour.isExtra && hour.toPay) {
            if (hour.type.toLowerCase().includes("nocturna"))
              nightHours += hour.total;
            else if (hour.type.toLowerCase().includes("diurna"))
              dayHours += hour.total;
          }
        });
      }

      return {
        [headers.year]: shift.startTime
          ? new Date(shift.startTime).getFullYear()
          : "",
        [headers.month]: shift.startTime
          ? new Date(shift.startTime).getMonth() + 1
          : "",
        [headers.day]: shift.startTime
          ? new Date(shift.startTime).getDate()
          : "",
        [headers.week]: shift.startTime
          ? Math.ceil(
              (Math.floor(
                (new Date(shift.startTime).getTime() -
                  new Date(
                    new Date(shift.startTime).getFullYear(),
                    0,
                    1
                  ).getTime()) /
                  86400000
              ) +
                new Date(shift.startTime).getDay() +
                1) /
                7
            )
          : "",
        [headers.date]: shift.startTime
          ? new Date(shift.startTime).toISOString().split("T")[0]
          : "",
        [headers.opsManager]: shift.opsManager,
        [headers.country]: shift.country,
        [headers.city]: shift.city,
        [headers.kitchenId]: shift.kitchenId,
        [headers.identification]: shift.identification,
        [headers.name]: shift.name,
        [headers.startTime]: formatValue("startTime", shift.startTime),
        [headers.endTime]: formatValue("endTime", shift.endTime),
        [headers.extraHours]: countApprovedOvertime(shift.extraHourReport),
        [headers.reason]: shift.reason ? t(`shiftManager.${shift.reason}`) : "",
        [headers.toPay]: shift.toPay ? t(`commons.${shift.toPay}`) : "",
        ...(shift.country === "COL" && {
          [headerCol.nightHours]: nightHours,
          [headerCol.dayHours]: dayHours,
        }),
        ...(shift.country === "MEX" && {
          [headerMex.isHoliday]: shift.isHoliday
            ? t(commons.YES)
            : t(commons.NO),
          [headerMex.doble]: doble,
          [headerMex.triple]: triple,
        }),
      };
    });

    const csvContent = json2Csv(data);
    const fileName = `${t(shiftManager.CONSOLIDATED_EXTRA_HOURS)} ${
      new Date().toISOString().split("T")[0]
    }.csv`;
    downloadTextAsCsv(csvContent, fileName);
  };

  return { getCSV };
};
