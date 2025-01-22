const TypingLoader = () => {
  return (
    <div className="flex items-center justify-center gap-1">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="w-2 h-2 bg-blue-500 rounded-full"
          style={{
            animation: "wave 1.2s infinite",
            animationDelay: `${index * 0.2}s`,
          }}
        ></div>
      ))}
      <style>
        {`
          @keyframes wave {
            0%, 60%, 100% {
              transform: initial;
              opacity: 1;
            }
            30% {
              transform: translateY(-10px);
              opacity: 0.5;
            }
          }
        `}
      </style>
    </div>
  );
};

export default TypingLoader;
