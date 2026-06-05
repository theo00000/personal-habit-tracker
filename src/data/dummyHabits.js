import { getDateDaysAgo, getTodayDate } from "../utils/date";

export const dummyHabits = [
  {
    id: 1,
    name: "Read 10 pages",
    category: "Learning",
    completions: [getDateDaysAgo(2), getDateDaysAgo(1), getTodayDate()],
  },
  {
    id: 2,
    name: "Drink 2L water",
    category: "Health",
    completions: [getDateDaysAgo(1), getTodayDate()],
  },
  {
    id: 3,
    name: "Workout 20 minutes",
    category: "Fitness",
    completions: [],
  },
];
