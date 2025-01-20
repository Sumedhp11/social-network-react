import React, { useRef, useState } from "react";

interface MediaViewerProps {
  postImage: File;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ postImage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full h-56">
      {postImage.type.split("/")[0] === "image" ? (
        // Render Image
        <img
          src={URL.createObjectURL(postImage)}
          alt="post-image"
          className="h-56 w-full object-contain rounded-xl"
          width={400}
          height={900}
        />
      ) : (
        // Render Video
        <div className="relative w-full h-56">
          <video
            ref={videoRef}
            src={URL.createObjectURL(postImage)}
            className="h-56 w-full object-contain rounded-xl"
            width={400}
            height={900}
            controls={false} // Hide default controls
          />

          {/* Custom Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-75 transition"
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
                width={24}
                height={24}
              >
                <path d="M5.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8a.5.5 0 0 1 .5-.5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
                width={24}
                height={24}
              >
                <path d="M10.804 8.462 5.71 11.137a.5.5 0 0 1-.71-.453V5.316a.5.5 0 0 1 .71-.453l5.094 2.676a.5.5 0 0 1 0 .894z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaViewer;
