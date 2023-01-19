import dayjs from "dayjs";

export function nowPlusMonths(months: number) {
  return dayjs().add(months, "month");
}
