import dayjs from "dayjs";

export function formatDate(date) {
  return dayjs(date).format("MMM DD, YYYY hh:mm A");
}
