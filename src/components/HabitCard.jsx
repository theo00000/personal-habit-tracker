import { CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react";

function HabitCard({ habit, onToggle, onDelete, onEdit }) {
  return (
    <article
      className={`rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
        habit.completedToday ? "border-green-100" : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {habit.time || "09:00"}
            </span>

            <span className="text-sm font-medium text-gray-500">
              {habit.category}
            </span>
          </div>

          <h3 className="mt-4 text-xl font-semibold leading-snug text-gray-950">
            {habit.name}
          </h3>

          <p className="mt-3 text-sm text-gray-500">
            Current streak:{" "}
            <span className="font-semibold text-gray-900">
              {habit.streak} {habit.streak === 1 ? "day" : "days"}
            </span>
          </p>
        </div>

        <button
          onClick={() => onToggle(habit.id)}
          className={`shrink-0 rounded-full p-2.5 transition hover:scale-105 ${
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
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <p className="text-xs font-medium text-gray-400">
          {habit.completedToday ? "Completed today" : "Not completed yet"}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(habit)}
            className="rounded-full bg-blue-50 p-2 text-blue-500 transition hover:scale-105 hover:bg-blue-100"
            aria-label={`Edit ${habit.name}`}
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(habit.id)}
            className="rounded-full bg-red-50 p-2 text-red-500 transition hover:scale-105 hover:bg-red-100"
            aria-label={`Delete ${habit.name}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default HabitCard;
