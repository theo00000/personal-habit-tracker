export const HABIT_LIMITS = {
  nameMaxLength: 50,
  categoryMaxLength: 24,
};

export const validateHabitInput = ({ name, category, time }) => {
  const trimmedName = name.trim();
  const trimmedCategory = category.trim();

  if (!trimmedName) {
    return "Habit name is required.";
  }

  if (!trimmedCategory) {
    return "Category is required.";
  }

  if (!time) {
    return "Time is required.";
  }

  if (trimmedName.length > HABIT_LIMITS.nameMaxLength) {
    return `Habit name must be ${HABIT_LIMITS.nameMaxLength} characters or less.`;
  }

  if (trimmedCategory.length > HABIT_LIMITS.categoryMaxLength) {
    return `Category must be ${HABIT_LIMITS.categoryMaxLength} characters or less.`;
  }

  return "";
};
