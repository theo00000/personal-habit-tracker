import { formatDate } from "./date";

export const calculateCurrentStreak = (completions = []) => {
  const completedDates = new Set(completions);
  let streak = 0;

  const currentDate = new Date();

  while (true) {
    const dateKey = formatDate(currentDate);

    if (!completedDates.has(dateKey)) {
      break;
    }

    streak += 1;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};
