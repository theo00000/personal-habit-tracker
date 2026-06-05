function HabitForm({
  isEditing,
  habitName,
  habitCategory,
  habitTime,
  onNameChange,
  onCategoryChange,
  onTimeChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-950">
        {isEditing ? "Edit Habit" : "Add New Habit"}
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="habit-name"
            className="text-sm font-medium text-gray-600"
          >
            Habit Name
          </label>

          <input
            id="habit-name"
            type="text"
            value={habitName}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Example: Read 10 pages"
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-950"
            required
          />
        </div>

        <div>
          <label
            htmlFor="habit-category"
            className="text-sm font-medium text-gray-600"
          >
            Category
          </label>

          <input
            id="habit-category"
            type="text"
            value={habitCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            placeholder="Example: Learning"
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-950"
            required
          />
        </div>

        <div>
          <label
            htmlFor="habit-time"
            className="text-sm font-medium text-gray-600"
          >
            Time
          </label>

          <input
            id="habit-time"
            type="time"
            value={habitTime}
            onChange={(event) => onTimeChange(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-950"
            required
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          {isEditing ? "Save Changes" : "Save Habit"}
        </button>
      </div>
    </form>
  );
}

export default HabitForm;
