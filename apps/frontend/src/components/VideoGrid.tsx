import React, { RefObject } from 'react';

interface RemoteStream {
  stream: MediaStream;
  peerId: string;
  label: string; // e.g., 'cam', 'screen'
}

interface VideoGridProps {
  localVideoRef: RefObject<HTMLVideoElement>;
  remoteStreams: RemoteStream[];
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
      {/* Local webcam feed */}
      {isCameraOn && (
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

      {/* Remote video streams */}
      {remoteStreams.map(({ stream, peerId, label }) => (
         <div key={`${peerId}-${label}`} className="relative bg-black rounded-xl overflow-hidden">
          <video
            autoPlay
            playsInline
            muted={label === 'screen'} // don't double play audio
            className="w-full h-full object-cover"
            ref={(el) => {
              if (el && el.srcObject !== stream) {
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
