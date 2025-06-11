import React, { useState, useEffect } from 'react';
import { useRoomStore } from '../../store/useRoomStror';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Square, 
  Pause, 
  Play,
  Settings, 
  Users, 
  Share2, 
  Volume2,
  VolumeX,
  Monitor,
  MonitorOff,
  Phone,
  PhoneOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Studio: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [volume, setVolume] = useState(75);
  const navigate = useNavigate()
   const {createRoom,isLoading} = useRoomStore()


  const token  = localStorage.getItem('token')
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
    const userData = localStorage.getItem("userData")
    const peerId = userData ? JSON.parse(userData).id : Math.random();
    const date = new Date().toISOString();
   
    const handleStartRecordingjoinRoom = async() => {
     const roomId = await createRoom('test', `${date}`,`${peerId}`); // eslint-disable-next-line
      if(roomId){
       navigate(`/dashboard/${roomId}`);
      }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white">Recording Studio</h1>
            <div className={`flex items-center space-x-3 px-4 py-2 rounded-full ${
              isRecording 
                ? isPaused 
                  ? 'bg-yellow-500/20 border border-yellow-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
                : 'bg-gray-500/20 border border-gray-500/30'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                isRecording 
                  ? isPaused 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500 animate-pulse'
                  : 'bg-gray-500'
              }`} />
              <span className="text-white font-mono text-lg">
                {isRecording 
                  ? isPaused 
                    ? `PAUSED ${formatTime(recordingTime)}`
                    : `REC ${formatTime(recordingTime)}`
                  : 'READY'
                }
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </button>
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Recording Area */}
      <div className="flex-1 flex">
        {/* Video Preview */}
        <div className="flex-1 p-8">
          <div className="h-full bg-black/30 backdrop-blur-sm border border-white/10 rounded-3xl relative overflow-hidden">
            {videoEnabled ? (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-white font-bold text-4xl">A</span>
                    </div>
                    <p className="text-white text-xl font-semibold">Alex Johnson</p>
                    <p className="text-purple-300">Video Active</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <VideoOff className="w-24 h-24 text-gray-500 mx-auto mb-6" />
                  <p className="text-gray-400 text-xl">Camera is off</p>
                  <button 
                    onClick={() => setVideoEnabled(true)}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200"
                  >
                    Turn on camera
                  </button>
                </div>
              </div>
            )}

            {/* Audio Visualizer */}
            {audioEnabled && (
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center justify-center space-x-1">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-150"
                        style={{ 
                          height: `${Math.random() * 30 + 4}px`,
                          opacity: isRecording && !isPaused ? 1 : 0.3
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recording Status Overlay */}
            {isRecording && (
              <div className="absolute top-6 right-6">
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-300 font-medium">LIVE</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-96 bg-black/20 backdrop-blur-sm border-l border-white/10 p-6">
          <div className="space-y-8">
            {/* Recording Controls */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Recording Controls</h3>
              <div className="space-y-4">
                {!isRecording ? (
                  <button
                    onClick={handleStartRecordingjoinRoom }
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 bg-white rounded-full" />
                      <span>Start Recording</span>
                    </div>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={handlePauseResume}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                        <span>{isPaused ? 'Resume' : 'Pause'}</span>
                      </div>
                    </button>
                    <button
                      onClick={handleStopRecording}
                      className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Square className="w-5 h-5" />
                        <span>Stop Recording</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Audio/Video Controls */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Media Controls</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    audioEnabled 
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                      : 'bg-red-500/20 border border-red-500/30 text-red-400'
                  }`}
                >
                  {audioEnabled ? <Mic className="w-6 h-6 mx-auto" /> : <MicOff className="w-6 h-6 mx-auto" />}
                </button>
                
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    videoEnabled 
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                      : 'bg-red-500/20 border border-red-500/30 text-red-400'
                  }`}
                >
                  {videoEnabled ? <Video className="w-6 h-6 mx-auto" /> : <VideoOff className="w-6 h-6 mx-auto" />}
                </button>
                
                <button
                  onClick={() => setScreenShare(!screenShare)}
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    screenShare 
                      ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' 
                      : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
                  }`}
                >
                  {screenShare ? <Monitor className="w-6 h-6 mx-auto" /> : <MonitorOff className="w-6 h-6 mx-auto" />}
                </button>
                
                <button className="p-4 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-xl transition-all duration-200 hover:bg-gray-500/30">
                  <Users className="w-6 h-6 mx-auto" />
                </button>
              </div>
            </div>

            {/* Volume Control */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Audio Level</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${volume}%` }}
                    />
                  </div>
                  <span className="text-white text-sm font-mono">{volume}%</span>
                </div>
              </div>
            </div>

            {/* Recording Settings */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quality Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Audio Quality</span>
                  <select className="bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-600">
                    <option>High (48kHz)</option>
                    <option>Standard (44.1kHz)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Video Quality</span>
                  <select className="bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-600">
                    <option>1080p HD</option>
                    <option>720p</option>
                    <option>480p</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Session Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-mono">{formatTime(recordingTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">File Size</span>
                  <span className="text-white">~{Math.floor(recordingTime / 60 * 2.5)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Format</span>
                  <span className="text-white">MP3 + MP4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;