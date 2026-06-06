import { useState } from "react";
import { Plus } from "lucide-react";

import EmptyState from "../components/EmptyState";
import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";
import ProgressCard from "../components/ProgressCard";
import { useHabits } from "../hooks/useHabits";
import { validateHabitInput } from "../utils/habitValidation";

function Dashboard() {
  const {
    habits,
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
  } = useHabits();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [habitCategory, setHabitCategory] = useState("");
  const [habitTime, setHabitTime] = useState("09:00");
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setHabitName("");
    setHabitCategory("");
    setHabitTime("09:00");
    setEditingHabitId(null);
    setIsFormOpen(false);
    setFormError("");
  };

  const handleOpenAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEditHabit = (habit) => {
    setHabitName(habit.name);
    setHabitCategory(habit.category);
    setHabitTime(habit.time || "09:00");
    setEditingHabitId(habit.id);
    setIsFormOpen(true);
    setFormError("");
  };

  const handleSubmitHabit = async (event) => {
    event.preventDefault();

    const validationError = validateHabitInput({
      name: habitName,
      category: habitCategory,
      time: habitTime,
    });

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      if (editingHabitId !== null) {
        await editHabit(editingHabitId, {
          name: habitName.trim(),
          category: habitCategory.trim(),
          time: habitTime,
        });

        resetForm();
        return;
      }

      await addHabit({
        name: habitName.trim(),
        category: habitCategory.trim(),
        time: habitTime,
      });

      resetForm();
    } catch {
      setFormError("Failed to save habit. Please try again.");
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

        {syncStatus === "offline" && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-700">
            You are offline. Changes are saved locally and will sync later.
          </div>
        )}

        {syncStatus === "syncing" && (
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-medium text-blue-700">
            Syncing offline changes...
          </div>
        )}

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
            formError={formError}
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
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={toggleHabitCompletion}
                    onDelete={removeHabit}
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
