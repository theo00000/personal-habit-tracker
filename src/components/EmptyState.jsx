function EmptyState({ onAddHabit }) {
  return (
    <div className="mt-4 rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center">
      <h3 className="text-lg font-semibold text-gray-950">No habits yet.</h3>

      <p className="mt-2 text-sm text-gray-500">
        Add your first habit to start tracking your daily progress.
      </p>

      <button
        onClick={onAddHabit}
        className="mt-5 rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        Add First Habit
      </button>
    </div>
  );
}

export default EmptyState;
