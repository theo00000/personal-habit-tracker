function ProgressCard({ progress, completedHabits, totalHabits }) {
  return (
    <div className="rounded-3xl bg-gray-950 p-6 text-white shadow-sm">
      <p className="text-sm text-gray-300">Daily completion</p>

      <h2 className="mt-4 text-6xl font-bold">{progress}%</h2>

      <p className="mt-4 text-gray-300">
        {completedHabits} of {totalHabits} habits completed today.
      </p>

      <div
        className="mt-6 h-3 rounded-full bg-white/15"
        aria-label={`Daily progress ${progress}%`}
      >
        <div
          className="h-3 rounded-full bg-white transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressCard;
