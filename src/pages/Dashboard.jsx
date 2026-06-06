import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";
import ProgressCard from "../components/ProgressCard";
import EmptyState from "../components/EmptyState";

import { getTodayDate } from "../utils/date";
import { calculateCurrentStreak } from "../utils/streak";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabit,
} from "../services/habitApi";

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [habitCategory, setHabitCategory] = useState("");
  const [habitTime, setHabitTime] = useState("09:00");
  const [editingHabitId, setEditingHabitId] = useState(null);

  const today = getTodayDate();

  useEffect(() => {
    let isMounted = true;

    const loadHabits = async () => {
      try {
        const data = await getHabits();

        if (isMounted) {
          setHabits(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadHabits();

    return () => {
      isMounted = false;
    };
  }, []);

  const completedHabits = habits.filter((habit) =>
    (habit.completions || []).includes(today),
  ).length;

  const totalHabits = habits.length;

  const progress =
    totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  const sortedHabits = [...habits].sort((a, b) => {
    const timeA = a.time || "09:00";
    const timeB = b.time || "09:00";

    return timeA.localeCompare(timeB);
  });

  const resetForm = () => {
    setHabitName("");
    setHabitCategory("");
    setHabitTime("09:00");
    setEditingHabitId(null);
    setIsFormOpen(false);
  };

  const handleOpenAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleToggleHabit = async (habitId) => {
    try {
      setErrorMessage("");

      const updatedHabit = await toggleHabit(habitId, today);

      const updatedHabits = habits.map((habit) => {
        if (habit.id === habitId) {
          return updatedHabit;
        }

        return habit;
      });

      setHabits(updatedHabits);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      setErrorMessage("");

      await deleteHabit(habitId);

      const updatedHabits = habits.filter((habit) => habit.id !== habitId);
      setHabits(updatedHabits);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleEditHabit = (habit) => {
    setHabitName(habit.name);
    setHabitCategory(habit.category);
    setHabitTime(habit.time || "09:00");
    setEditingHabitId(habit.id);
    setIsFormOpen(true);
  };

  const handleSubmitHabit = async (event) => {
    event.preventDefault();

    if (!habitName.trim() || !habitCategory.trim() || !habitTime.trim()) {
      return;
    }

    try {
      setErrorMessage("");

      if (editingHabitId !== null) {
        const updatedHabit = await updateHabit(editingHabitId, {
          name: habitName,
          category: habitCategory,
          time: habitTime,
        });

        const updatedHabits = habits.map((habit) => {
          if (habit.id === editingHabitId) {
            return updatedHabit;
          }

          return habit;
        });

        setHabits(updatedHabits);
        resetForm();
        return;
      }

      const newHabit = await createHabit({
        name: habitName,
        category: habitCategory,
        time: habitTime,
      });

      setHabits([newHabit, ...habits]);
      resetForm();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-8 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Today&apos;s Progress
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950">
              Build better habits.
            </h1>

            <p className="mt-3 text-gray-600">
              Track your daily routines and keep your streak alive.
            </p>
          </div>

          <button
            onClick={handleOpenAddForm}
            className="flex items-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            <Plus size={18} />
            Add Habit
          </button>
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        {isFormOpen && (
          <HabitForm
            isEditing={editingHabitId !== null}
            habitName={habitName}
            habitCategory={habitCategory}
            habitTime={habitTime}
            onNameChange={setHabitName}
            onCategoryChange={setHabitCategory}
            onTimeChange={setHabitTime}
            onSubmit={handleSubmitHabit}
            onCancel={resetForm}
          />
        )}

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[420px_1fr]">
          <ProgressCard
            progress={progress}
            completedHabits={completedHabits}
            totalHabits={totalHabits}
          />
          <div>
            <div>
              <h2 className="text-xl font-semibold text-gray-950">
                Today&apos;s Habits
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Sorted from morning to night.
              </p>
            </div>

            {isLoading ? (
              <div className="mt-4 rounded-3xl bg-white p-8 text-center text-sm text-gray-500">
                Loading habits...
              </div>
            ) : habits.length === 0 ? (
              <EmptyState onAddHabit={handleOpenAddForm} />
            ) : (
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                {sortedHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={{
                      ...habit,
                      completedToday: (habit.completions || []).includes(today),
                      streak: calculateCurrentStreak(habit.completions || []),
                    }}
                    onToggle={handleToggleHabit}
                    onDelete={handleDeleteHabit}
                    onEdit={handleEditHabit}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
