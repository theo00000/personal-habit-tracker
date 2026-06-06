import { useEffect, useState } from "react";

function ProgressCard({ progress, completedHabits, totalHabits }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 120);

    return () => clearTimeout(timeout);
  }, [progress]);

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (animatedProgress / 100) * circumference;

  const progressLabel =
    progress === 100
      ? "All habits completed. Great consistency today."
      : "Keep going. Small progress still builds momentum.";

  return (
    <aside className="relative overflow-hidden rounded-4xl bg-gray-950 p-7 text-white shadow-sm">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-16 left-6 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10">
        <p className="text-sm font-medium text-gray-300">Daily completion</p>

        <div className="mt-8 flex flex-col items-center text-center">
          <div className="relative flex h-44 w-44 items-center justify-center">
            <svg
              className="-rotate-90"
              width="176"
              height="176"
              viewBox="0 0 176 176"
              aria-label={`Daily progress ${progress}%`}
            >
              <circle
                cx="88"
                cy="88"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="16"
              />

              <circle
                cx="88"
                cy="88"
                r={radius}
                fill="none"
                stroke="white"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                {animatedProgress}%
              </h2>
              <p className="mt-1 text-sm text-gray-300">today</p>
            </div>
          </div>

          <div className="mt-7">
            <h3 className="text-3xl font-bold">
              {completedHabits} of {totalHabits}
            </h3>

            <p className="mt-3 max-w-xs text-sm leading-6 text-gray-300">
              {progressLabel}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="h-3 rounded-full bg-white/15">
            <div
              className="h-3 rounded-full bg-white transition-all duration-700 ease-out"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default ProgressCard;
