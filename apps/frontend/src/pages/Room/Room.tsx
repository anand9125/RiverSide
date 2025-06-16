import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Video, Settings, Users } from 'lucide-react';
import { useMediaSoup } from '../../services/useMediaSoup';
import { ControlBar } from '../../components/ControlBar';
import VideoGrid from '../../components/VideoGrid';
import { v4 as uuidv4 } from 'uuid';
import { useRecordingManager } from '../../components/RecordingControll';
function Room() {
  const [isRecording, setIsRecording] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const { startRecording, stopRecording, pauseRecording, resumeRecording, getRecordingState } = useRecordingManager()
  
  const userData = localStorage.getItem("userData");
  const username = userData ? JSON.parse(userData).name as string : "Guest";
  const { roomId } = useParams<{ roomId: string }>();
  const peerIdRef = useRef(userData ? JSON.parse(userData).id : uuidv4());  //useRef() is initialized once and doesn't change across re-renders.
  const peerId = peerIdRef.current;  /// try to locate in lcoalstorage



  const {
    isConnected,
    localVideoRef,
    remoteStreams,
    isScreenSharing,
    localStream,
    startScreenShare,
    toggleMicrophone,
    toggleCamera,
  } = useMediaSoup({
    roomId: roomId || 'default-room',
    peerId,
  });

  const handleRecording = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      startRecording(peerId, localStream!);
    }
  }; 
  const handleStopRecording = () => {
    setIsRecording(false);
    stopRecording(peerId);
  }
    const handleToggleScreenShare = async () => {
    await startScreenShare();
  };


  const handleToggleMic = async () => {
    const newState = !isMicOn;
    setIsMicOn(newState);
    await toggleMicrophone(newState);
  };

  const handleToggleCamera = async () => {
    const newState = !isCameraOn;
    setIsCameraOn(newState);
    await toggleCamera(newState);
  };


  const handleLeave = () => {
    // Navigate back or close the room
    window.history.back();
  };
  const array = Array.from(remoteStreams.values())
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg">Connecting to room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">StreamStudio</span>
          </div>
          <div className="text-gray-400">•</div>
          <span className="text-gray-300">{username}'s Studio</span>
          <div className="text-gray-400">•</div>
          <span className="text-gray-400">Room: {roomId}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
            + Live stream{array.length > 0 ? array.length : ""}
          </button>
          <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg font-medium transition-colors flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Invite</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
       {/* bugs because of this Array.from(remoteStreams.values() its generate 2 values one of them is null fix it later */}

      <div className="flex-1 p-6">
        <VideoGrid
            localVideoRef={localVideoRef}
            remoteStreams={Array.from(remoteStreams.values())}
            username={username}
            isCameraOn={isCameraOn}
            isScreenSharing={isScreenSharing}
        />

      </div>

      {/* Control Bar */}
      <ControlBar
        isRecording={isRecording}
        isMicOn={isMicOn}
        isCameraOn={isCameraOn}
        isSpeakerOn={isSpeakerOn}
        isScreenSharing={isScreenSharing}
        onStartRecording={handleRecording}
        onStopRecording={handleStopRecording}
        onToggleMic={handleToggleMic}
        onToggleCamera={handleToggleCamera}
        onToggleSpeaker={() => setIsSpeakerOn(!isSpeakerOn)}
        onToggleScreenShare={handleToggleScreenShare}
        onLeave={handleLeave}
      />
    </div>
  );
}

export default Room;