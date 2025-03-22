import { useEffect, useState } from "react";

export function SocialLoader() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing servers...");

  useEffect(() => {
    const updateMessage = (currentProgress: number) => {
      if (currentProgress < 30) return "Initializing servers...";
      if (currentProgress < 60) return "Getting things ready...";
      if (currentProgress < 90) return "Almost ready...";
      return "Launching your social space...";
    };

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const nextProgress = prev + 2;
        setMessage(updateMessage(nextProgress));
        return nextProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#06141d] text-white/80 text-sm font-medium tracking-wide">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#ddd"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#189FF2"
            strokeWidth="4"
            fill="none"
            strokeDasharray="283"
            strokeDashoffset={283 - (progress / 100) * 283}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fontSize="16"
            fill="#FFFFFF"
            fontWeight="bold"
          >
            {progress}%
          </text>
        </svg>
      </div>
      <p className="mt-4">{message}</p>
    </div>
  );
}

export default SocialLoader;
