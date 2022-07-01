import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

const fetchProps = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export function formatDate(date) {
  return dayjs.utc(date).format("MMM DD, YYYY hh:mm A");
}

export function getData(url) {
  return fetch(url, {
    method: "GET",
    ...fetchProps,
  });
}

export function postData(url, data) {
  return fetch(url, {
    method: "POST",
    ...fetchProps,
    body: JSON.stringify(data),
  });
}

export function deleteData(url) {
  return fetch(url, {
    method: "DELETE",
    ...fetchProps,
  });
}

export function patchData(url, data) {
  return fetch(url, {
    method: "PATCH",
    ...fetchProps,
    body: JSON.stringify(data),
  });
}

export const Days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const removeDuplicates = (arr, prop) => {
  return arr.filter((value, index) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      arr.findIndex((obj) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });
};
