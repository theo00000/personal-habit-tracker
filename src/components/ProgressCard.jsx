import { useEffect, useState } from "react";

function ProgressCard({ progress, completedHabits, totalHabits }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 120);

    return () => clearTimeout(timeout);
  }, [progress]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gray-950 p-6 text-white shadow-sm">
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-14 left-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

      <div className="relative z-10">
        <p className="text-sm text-gray-300">Daily completion</p>

        <div className="mt-6 flex items-center gap-6">
          <div className="relative flex h-36 w-36 items-center justify-center">
            <svg
              className="-rotate-90"
              width="144"
              height="144"
              viewBox="0 0 144 144"
              aria-label={`Daily progress ${progress}%`}
            >
              <circle
                cx="72"
                cy="72"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="14"
              />

              <circle
                cx="72"
                cy="72"
                r={radius}
                fill="none"
                stroke="white"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute text-center">
              <h2 className="text-4xl font-bold">{animatedProgress}%</h2>
              <p className="mt-1 text-xs text-gray-300">today</p>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-semibold">
              {completedHabits} of {totalHabits}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-300">
              habits completed today. Keep your routine consistent and protect
              your streak.
            </p>

            <div className="mt-5 h-3 rounded-full bg-white/15">
              <div
                className="h-3 rounded-full bg-white transition-all duration-700 ease-out"
                style={{ width: `${animatedProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressCard;
