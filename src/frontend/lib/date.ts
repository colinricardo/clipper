import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const getAgoString = (date: string | number) => {
  let _date;
  // If the input is a number, it's assumed to be a Unix timestamp
  if (typeof date === "number") {
    _date = new Date(date * 1000);
  } else {
    _date = date;
  }

  return dayjs(_date).fromNow();
};

const isoStringToDate = (isoDate: string | number) => {
  let date;

  // If the input is a number, it's assumed to be a Unix timestamp
  if (typeof isoDate === "number") {
    date = new Date(isoDate * 1000);
  } else {
    date = isoDate;
  }

  return dayjs(date, "YYYY-MM-DD").toDate();
};
const getLaterDate = (dateA: Date, dateB: Date) => {
  return dayjs(dateA).isAfter(dateB) ? dateA : dateB;
};

const bFollowsA = (dateA: Date, dateB: Date) => {
  return dayjs(dateB).isAfter(dateA);
};

export default {
  getAgoString,
  isoStringToDate,
  getLaterDate,
  bFollowsA,
};
