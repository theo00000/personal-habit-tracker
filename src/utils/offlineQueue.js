const HABIT_CACHE_KEY = "personal-habit-tracker-cache";
const SYNC_QUEUE_KEY = "personal-habit-tracker-sync-queue";

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const createActionId = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `sync-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const loadCachedHabits = () => {
  return safeParse(localStorage.getItem(HABIT_CACHE_KEY), []);
};

export const saveCachedHabits = (habits) => {
  localStorage.setItem(HABIT_CACHE_KEY, JSON.stringify(habits));
};

export const getPendingActions = () => {
  return safeParse(localStorage.getItem(SYNC_QUEUE_KEY), []);
};

export const savePendingActions = (actions) => {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(actions));
};

export const enqueueSyncAction = (action) => {
  const actions = getPendingActions();

  const withoutDuplicateAction = actions.filter((item) => {
    return !(
      item.type === action.type &&
      item.habitId === action.habitId &&
      item.date === action.date
    );
  });

  const nextActions = [
    ...withoutDuplicateAction,
    {
      ...action,
      id: createActionId(),
      createdAt: new Date().toISOString(),
    },
  ];

  savePendingActions(nextActions);

  return nextActions;
};

export const removeSyncAction = (actionId) => {
  const actions = getPendingActions();
  const nextActions = actions.filter((action) => action.id !== actionId);

  savePendingActions(nextActions);

  return nextActions;
};
