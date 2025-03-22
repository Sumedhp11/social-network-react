import { useEffect, useRef, useState } from "react";

export function SocialLoader() {
  const [message, setMessage] = useState("Initializing servers...");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions with proper scaling
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    let progress = 0;
    const progressSpeed = 0.5;
    const maxProgress = 100;

    // Update loading message based on progress
    const updateMessage = (currentProgress: number) => {
      if (currentProgress < 30) {
        setMessage("Initializing servers...");
      } else if (currentProgress < 60) {
        setMessage("Getting things ready...");
      } else if (currentProgress < 90) {
        setMessage("Almost ready...");
      } else {
        setMessage("Launching your social space...");
      }
    };

    const drawProgress = () => {
      if (!canvas || !ctx) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 45;

      // Draw outer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw progress arc
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (progress / maxProgress) * (Math.PI * 2);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle = "#189FF2";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw progress text
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "600 18px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${Math.round(progress)}%`, centerX, centerY);
    };

    let animationId: number;

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawProgress();

      if (progress < maxProgress) {
        progress += progressSpeed * (1 - progress / maxProgress);
        if (progress > 99) progress = 99;
        updateMessage(progress);
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: "#06141d" }}
    >
      <div className="relative flex flex-col items-center">
        <canvas ref={canvasRef} className="w-[200px] h-[200px]" />
        <p className="mt-6 text-white/80 text-sm font-medium tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
}

export default SocialLoader;
