const APP_TIMEZONE = import.meta.env.VITE_APP_TIMEZONE || "Asia/Jakarta";

export const getTodayDate = () => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
};

export const formatDate = (date) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date);
};

export const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return formatDate(date);
};
