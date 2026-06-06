import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createHabit,
  deleteHabit,
  getHabits,
  setHabitCompletion,
  updateHabit,
} from "../services/habitApi";
import { getTodayDate } from "../utils/date";
import { calculateCurrentStreak } from "../utils/streak";
import {
  enqueueSyncAction,
  getPendingActions,
  loadCachedHabits,
  removeSyncAction,
  saveCachedHabits,
} from "../utils/offlineQueue";

const isNetworkError = (error) => {
  return (
    !navigator.onLine ||
    error.message.toLowerCase().includes("failed to fetch") ||
    error.message.toLowerCase().includes("network")
  );
};

const applyCompletionToHabits = (habits, habitId, date, completed) => {
  return habits.map((habit) => {
    if (habit.id !== habitId) {
      return habit;
    }

    const completions = habit.completions || [];
    const alreadyCompleted = completions.includes(date);

    if (completed && !alreadyCompleted) {
      return {
        ...habit,
        completions: [...completions, date].sort(),
      };
    }

    if (!completed && alreadyCompleted) {
      return {
        ...habit,
        completions: completions.filter((completionDate) => {
          return completionDate !== date;
        }),
      };
    }

    return habit;
  });
};

export const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [syncStatus, setSyncStatus] = useState("idle");

  const today = getTodayDate();

  const syncPendingActions = useCallback(async () => {
    if (!navigator.onLine) {
      setSyncStatus("offline");
      return;
    }

    const pendingActions = getPendingActions();

    if (pendingActions.length === 0) {
      setSyncStatus("synced");
      return;
    }

    try {
      setSyncStatus("syncing");

      for (const action of pendingActions) {
        if (action.type === "SET_COMPLETION") {
          await setHabitCompletion(action.habitId, {
            date: action.date,
            completed: action.completed,
          });

          removeSyncAction(action.id);
        }
      }

      const latestHabits = await getHabits();

      setHabits(latestHabits);
      saveCachedHabits(latestHabits);
      setErrorMessage("");
      setSyncStatus("synced");
    } catch {
      setSyncStatus("offline");
      setErrorMessage(
        "Changes are saved offline and will sync when the connection is stable.",
      );
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchInitialHabits = async () => {
      try {
        const data = await getHabits({
          signal: controller.signal,
        });

        setHabits(data);
        saveCachedHabits(data);
        setErrorMessage("");
        setSyncStatus("synced");
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        const cachedHabits = loadCachedHabits();

        if (cachedHabits.length > 0) {
          setHabits(cachedHabits);
          setSyncStatus("offline");
          setErrorMessage(
            "Showing saved offline data. Changes will sync when you are back online.",
          );
          return;
        }

        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialHabits();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      syncPendingActions();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [syncPendingActions]);

  const completedHabits = habits.filter((habit) => {
    return (habit.completions || []).includes(today);
  }).length;

  const totalHabits = habits.length;

  const progress =
    totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  const visibleHabits = useMemo(() => {
    return [...habits]
      .sort((a, b) => {
        const timeA = a.time || "09:00";
        const timeB = b.time || "09:00";

        return timeA.localeCompare(timeB);
      })
      .map((habit) => {
        return {
          ...habit,
          completedToday: (habit.completions || []).includes(today),
          streak: calculateCurrentStreak(habit.completions || []),
        };
      });
  }, [habits, today]);

  const addHabit = async ({ name, category, time }) => {
    try {
      setErrorMessage("");

      const newHabit = await createHabit({
        name,
        category,
        time,
      });

      setHabits((currentHabits) => {
        const nextHabits = [newHabit, ...currentHabits];
        saveCachedHabits(nextHabits);

        return nextHabits;
      });

      return newHabit;
    } catch (error) {
      setErrorMessage(error.message);
      throw error;
    }
  };

  const editHabit = async (habitId, { name, category, time }) => {
    try {
      setErrorMessage("");

      const updatedHabit = await updateHabit(habitId, {
        name,
        category,
        time,
      });

      setHabits((currentHabits) => {
        const nextHabits = currentHabits.map((habit) => {
          if (habit.id === habitId) {
            return updatedHabit;
          }

          return habit;
        });

        saveCachedHabits(nextHabits);

        return nextHabits;
      });

      return updatedHabit;
    } catch (error) {
      setErrorMessage(error.message);
      throw error;
    }
  };

  const removeHabit = async (habitId) => {
    try {
      setErrorMessage("");

      await deleteHabit(habitId);

      setHabits((currentHabits) => {
        const nextHabits = currentHabits.filter((habit) => {
          return habit.id !== habitId;
        });

        saveCachedHabits(nextHabits);

        return nextHabits;
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const toggleHabitCompletion = async (habitId) => {
    const selectedHabit = habits.find((habit) => habit.id === habitId);

    if (!selectedHabit) {
      return;
    }

    const isCompletedToday = (selectedHabit.completions || []).includes(today);
    const nextCompletedStatus = !isCompletedToday;
    const previousHabits = habits;

    const optimisticHabits = applyCompletionToHabits(
      habits,
      habitId,
      today,
      nextCompletedStatus,
    );

    setHabits(optimisticHabits);
    saveCachedHabits(optimisticHabits);

    try {
      setErrorMessage("");

      if (!navigator.onLine) {
        throw new Error("offline");
      }

      const updatedHabit = await setHabitCompletion(habitId, {
        date: today,
        completed: nextCompletedStatus,
      });

      setHabits((currentHabits) => {
        const nextHabits = currentHabits.map((habit) => {
          if (habit.id === habitId) {
            return updatedHabit;
          }

          return habit;
        });

        saveCachedHabits(nextHabits);

        return nextHabits;
      });

      setSyncStatus("synced");
    } catch (error) {
      if (isNetworkError(error) || error.message === "offline") {
        enqueueSyncAction({
          type: "SET_COMPLETION",
          habitId,
          date: today,
          completed: nextCompletedStatus,
        });

        setSyncStatus("offline");
        setErrorMessage(
          "Saved offline. This completion will sync when you are back online.",
        );
        return;
      }

      setHabits(previousHabits);
      saveCachedHabits(previousHabits);
      setErrorMessage(error.message);
    }
  };

  return {
    habits: visibleHabits,
    isLoading,
    errorMessage,
    syncStatus,
    completedHabits,
    totalHabits,
    progress,
    addHabit,
    editHabit,
    removeHabit,
    toggleHabitCompletion,
  };
};
