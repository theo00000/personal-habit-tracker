export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getTodayDate = () => {
  return formatDate(new Date());
};

export const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return formatDate(date);
};
