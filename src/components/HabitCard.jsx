import { CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react";

function HabitCard({ habit, onToggle, onDelete, onEdit }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {habit.time || "09:00"}
            </span>

            <p className="text-sm font-medium text-gray-500">
              {habit.category}
            </p>
          </div>

          <h3 className="mt-3 text-xl font-semibold text-gray-950">
            {habit.name}
          </h3>

          <p className="mt-3 text-sm text-gray-500">
            Current streak:{" "}
            <span className="font-semibold text-gray-900">
              {habit.streak} days
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(habit.id)}
            className={`rounded-full p-2 transition hover:scale-105 ${
              habit.completedToday
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
            aria-label={`Toggle ${habit.name}`}
          >
            {habit.completedToday ? (
              <CheckCircle2 size={26} />
            ) : (
              <Circle size={26} />
            )}
          </button>

          <button
            onClick={() => onEdit(habit)}
            className="rounded-full bg-blue-50 p-2 text-blue-500 transition hover:scale-105 hover:bg-blue-100"
            aria-label={`Edit ${habit.name}`}
          >
            <Pencil size={20} />
          </button>

          <button
            onClick={() => onDelete(habit.id)}
            className="rounded-full bg-red-50 p-2 text-red-500 transition hover:scale-105 hover:bg-red-100"
            aria-label={`Delete ${habit.name}`}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default HabitCard;
