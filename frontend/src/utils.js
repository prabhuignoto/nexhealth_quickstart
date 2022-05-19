import dayjs from "dayjs";

export function formatDate(date) {
  return dayjs(date).format("MMM DD, YYYY hh:mm A");
}

export function getData(url) {
  return fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}
