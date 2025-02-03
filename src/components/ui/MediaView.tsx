import React, { useRef, useState, useEffect } from "react";

interface MediaViewerProps {
  postImage: File | string;
  containerClassName?: string;
  mediaClassName?: string;
  playButtonClassName?: string;
  showControls?: boolean;
  width?: number | string;
  height?: number | string;
}

const isVideoFile = (file: File) => file.type.startsWith("video/");
const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov|avi|wmv)$/i.test(url);

const isVideo = (media: File | string): boolean => {
  if (typeof media === "string") return isVideoUrl(media);
  return isVideoFile(media);
};

const MediaViewer: React.FC<MediaViewerProps> = ({
  postImage,
  containerClassName = "w-full h-56",
  mediaClassName = "w-full h-full object-contain rounded-xl",
  playButtonClassName = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-75 transition",
  showControls = false,
  width = 400,
  height = 900,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    let objectUrl: string | undefined;

    if (postImage instanceof File) {
      objectUrl = URL.createObjectURL(postImage);
      setUrl(objectUrl);
    } else {
      setUrl(postImage);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [postImage]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const isMediaVideo = isVideo(postImage);

  return (
    <div className={`relative ${containerClassName}`}>
      {!isMediaVideo ? (
        <img
          src={url}
          alt="Post content"
          className={mediaClassName}
          width={width}
          height={height}
        />
      ) : (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={url}
            className={mediaClassName}
            width={width}
            height={height}
            controls={showControls}
            onEnded={() => setIsPlaying(false)}
          />

          {!showControls && (
            <button
              onClick={togglePlayPause}
              className={playButtonClassName}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="w-6 h-6"
                >
                  <path d="M5.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8a.5.5 0 0 1 .5-.5z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="w-6 h-6"
                >
                  <path d="M10.804 8.462 5.71 11.137a.5.5 0 0 1-.71-.453V5.316a.5.5 0 0 1 .71-.453l5.094 2.676a.5.5 0 0 1 0 .894z" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaViewer;
