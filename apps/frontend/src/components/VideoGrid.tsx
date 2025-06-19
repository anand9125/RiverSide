import React, { RefObject } from 'react';

interface RemoteStream {
  stream: MediaStream;
  peerId: string;
  label: string;
}

interface VideoGridProps {
  localVideoRef: RefObject<HTMLVideoElement>;
  remoteStreams: Map<string, RemoteStream>;
  username: string;
  isCameraOn: boolean;
  isScreenSharing: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  localVideoRef,
  remoteStreams,
  username,
  isCameraOn,
  isScreenSharing,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {(isCameraOn || isScreenSharing) && (
        <div className="relative bg-black rounded-xl overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
            {username} (You)
          </div>
        </div>
      )}

      {Array.from(remoteStreams.values()).map(({ stream, peerId, label }) => (
        <div key={peerId} className="relative bg-black rounded-xl overflow-hidden">
          <video
            autoPlay
            playsInline
            muted={label === 'screen'}
            className="w-full h-full object-cover"
            ref={(el) => {
              if (el && stream && el.srcObject !== stream) {
                el.srcObject = stream;
              }
            }}
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
            {peerId.slice(0, 5)} {label === 'screen' ? '(Screen)' : ''}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
