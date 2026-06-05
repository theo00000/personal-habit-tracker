import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import HabitCard from "../components/HabitCard";
import { dummyHabits } from "../data/dummyHabits";
import { getTodayDate } from "../utils/date";
import { calculateCurrentStreak } from "../utils/streak";

const STORAGE_KEY = "personal-habit-tracker-habits";

function Dashboard() {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem(STORAGE_KEY);

    if (savedHabits) {
      return JSON.parse(savedHabits);
    }

    return dummyHabits;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [habitCategory, setHabitCategory] = useState("");
  const [editingHabitId, setEditingHabitId] = useState(null);

  const today = getTodayDate();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const completedHabits = habits.filter((habit) =>
    habit.completions?.includes(today),
  ).length;

  const totalHabits = habits.length;

  const progress =
    totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  const resetForm = () => {
    setHabitName("");
    setHabitCategory("");
    setEditingHabitId(null);
    setIsFormOpen(false);
  };

  const handleOpenAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleToggleHabit = (habitId) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const completions = habit.completions || [];
        const isCompletedToday = completions.includes(today);

        return {
          ...habit,
          completions: isCompletedToday
            ? completions.filter((date) => date !== today)
            : [...completions, today],
        };
      }

      return habit;
    });

    setHabits(updatedHabits);
  };

  const handleDeleteHabit = (habitId) => {
    const updatedHabits = habits.filter((habit) => habit.id !== habitId);
    setHabits(updatedHabits);
  };

  const handleEditHabit = (habit) => {
    setHabitName(habit.name);
    setHabitCategory(habit.category);
    setEditingHabitId(habit.id);
    setIsFormOpen(true);
  };

  const handleSubmitHabit = (event) => {
    event.preventDefault();

    if (!habitName.trim() || !habitCategory.trim()) {
      return;
    }

    if (editingHabitId) {
      const updatedHabits = habits.map((habit) => {
        if (habit.id === editingHabitId) {
          return {
            ...habit,
            name: habitName,
            category: habitCategory,
          };
        }

        return habit;
      });

      setHabits(updatedHabits);
      resetForm();
      return;
    }

    const newHabit = {
      id: Date.now(),
      name: habitName,
      category: habitCategory,
      completions: [],
    };

    setHabits([newHabit, ...habits]);
    resetForm();
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

        {isFormOpen && (
          <form
            onSubmit={handleSubmitHabit}
            className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-950">
              {editingHabitId ? "Edit Habit" : "Add New Habit"}
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Habit Name
                </label>

                <input
                  type="text"
                  value={habitName}
                  onChange={(event) => setHabitName(event.target.value)}
                  placeholder="Example: Read 10 pages"
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-950"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Category
                </label>

                <input
                  type="text"
                  value={habitCategory}
                  onChange={(event) => setHabitCategory(event.target.value)}
                  placeholder="Example: Learning"
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-950"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                {editingHabitId ? "Save Changes" : "Save Habit"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="rounded-3xl bg-gray-950 p-6 text-white shadow-sm">
            <p className="text-sm text-gray-300">Daily completion</p>

            <h2 className="mt-4 text-6xl font-bold">{progress}%</h2>

            <p className="mt-4 text-gray-300">
              {completedHabits} of {totalHabits} habits completed today.
            </p>

            <div className="mt-6 h-3 rounded-full bg-white/15">
              <div
                className="h-3 rounded-full bg-white transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-950">
              Today&apos;s Habits
            </h2>

            {habits.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-950">
                  No habits yet.
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Add your first habit to start tracking your daily progress.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={{
                      ...habit,
                      completedToday: habit.completions?.includes(today),
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
