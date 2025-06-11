import React, { useEffect, useRef, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Volume2, VolumeX, Settings, Users, Share, FileText, PhoneOff, Copy, Mail, ChevronDown, SwordIcon as Record, Pause } from 'lucide-react';
 import { useParams } from 'react-router-dom';
import { connectToServer, startWebcam } from '../mediaSoup';

function Room () {
  const [isRecording, setIsRecording] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [inviteLink] = useState('https://studio.streamapp.com/invite/anand-studio-xyz123');
  const [copied, setCopied] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const userData = localStorage.getItem("userData") 
  const username = userData ? JSON.parse(userData).name as string :" " as string;
  const { roomId } = useParams(); 
  const peerId = userData ? JSON.parse(userData).id :"guest";
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [remoteStreamReady, setRemoteStreamReady] = useState(false);
  const [joined, setJoined] = useState(false);
   const [isPublishing, setIsPublishing] = useState(false);
    

    useEffect(() => {
  const joinAndStart = async () => {
    try {
     await connectToServer(roomId!, peerId, (remoteStream) => {
        
        if (remoteVideoRef.current) {
          console.log(remoteStream,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
          remoteVideoRef.current.srcObject = remoteStream;
          setRemoteStreamReady(true);
          
          // Add event listeners for debugging
          remoteVideoRef.current.addEventListener('loadedmetadata', () => {
            console.log('✅ Remote video metadata loaded');
          });
          
          remoteVideoRef.current.addEventListener('canplay', () => {
            console.log('✅ Remote video can play');
            const videoTrack = remoteStream.getVideoTracks()[0];
            if (videoTrack) {
              console.log('📹 Video track state:', videoTrack.readyState);
              console.log('📹 Video track enabled:', videoTrack.enabled);
              console.log('📹 Video track muted:', videoTrack.muted);
            }
            
            // Auto-play the remote video
            const playPromise = remoteVideoRef.current?.play();
            if (playPromise) {
              playPromise
                .then(() => {
                  console.log(' Remote video playing!');
                })
                .catch((error) => {
                  console.error(' Remote video play failed:', error);
                });
            }
          });

          remoteVideoRef.current.addEventListener('playing', () => {
            console.log(' Remote video is now playing');
          });

          remoteVideoRef.current.addEventListener('error', (e) => {
            console.error('Remote video error:', e);
          });
        }
      });

      console.log('✅ Joined room. Now starting webcam...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        },
        audio: false,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      await startWebcam(roomId!, peerId, stream);
      console.log('📹 Webcam published successfully');
      setJoined(true);

    } catch (error) {
      console.error('❌ Error during room join or webcam start:', error);
    }
  };

  joinAndStart();
}, []);

     
    const forcePlay = async () => {
    if (remoteVideoRef.current) {
      try {
        await remoteVideoRef.current.play();
        console.log(" Manual play successful");
      } catch (error) {
        console.error("Manual play failed:", error);
      }
    }
  };
  forcePlay()
 
 
   const handleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const handleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const handleSpeaker = () => {
        
    }
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

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
          <span className="text-gray-400">Untitled Recording</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
            + Live stream
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
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* My Stream */}
          <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                {username}
              </div>
            </div>
            
            

            {/* Video Placeholder */}
           <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            {isCameraOn ? (
                <div className="w-full h-full">
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-lg"
                />
                </div>
            ) : (
                <div className="text-center">
                <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">{username.split(' ').map(word => word[0]).join('').toUpperCase()}</span>
                    </div>
                </div>
                <p className="text-gray-300">Your camera is {isCameraOn ? 'on' : 'off'}</p>
                </div>
            )}
            </div>


            {/* Status indicators */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {!isMicOn && (
                <div className="p-2 bg-red-500/80 backdrop-blur-sm rounded-full">
                  <MicOff className="w-4 h-4" />
                </div>
              )}
              {!isCameraOn && (
                <div className="p-2 bg-red-500/80 backdrop-blur-sm rounded-full">
                  <VideoOff className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          {/* Consumer Stream / Invite Section */}
          <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
            {
              remoteStreamReady ? 
                <div className="w-full h-full">
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    muted={false}
                    controls
                    playsInline
                    className="w-full h-full object-cover rounded-lg"
                />
                </div> :<div className="w-full h-full flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold mb-2">Invite people</h2>
                <p className="text-gray-400 mb-8">Share this link to invite people to your studio.</p>
                
                {/* Invite Link */}
                <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <input 
                      type="text" 
                      value={inviteLink}
                      readOnly
                      className="flex-1 bg-transparent text-gray-300 text-sm focus:outline-none"
                    />
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1 bg-gray-600/50 hover:bg-gray-500/50 rounded-lg text-sm transition-colors">
                        <span>Guest</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={handleCopyLink}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copied ? 'Copied!' : 'Copy link'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-gray-500 mb-6">or</div>

                <button className="w-full py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Invite by email</span>
                </button>
              </div>
            </div>  
            }
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="border-t border-gray-700/50 p-6">
        <div className="flex items-center justify-center space-x-4">
          {/* Record Button */}
          <button
            onClick={toggleRecording}
            className={`flex items-center space-x-3 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-700/50 hover:bg-red-500/20 hover:text-red-400'
            }`}
          >
            {isRecording ? <Pause className="w-5 h-5" /> : <Record className="w-5 h-5" />}
            <span>{isRecording ? 'Stop' : 'Record'}</span>
          </button>

          {/* Mic Button */}
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-4 rounded-full transition-all duration-200 ${
              isMicOn 
                ? 'bg-gray-700/50 hover:bg-gray-600/50 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera Button */}
          <button
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`p-4 rounded-full transition-all duration-200 ${
              isCameraOn 
                ? 'bg-gray-700/50 hover:bg-gray-600/50 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Speaker Button */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-4 rounded-full transition-all duration-200 ${
              isSpeakerOn 
                ? 'bg-gray-700/50 hover:bg-gray-600/50 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Script Button */}
          <button className="p-4 bg-gray-700/50 hover:bg-gray-600/50 rounded-full transition-colors">
            <FileText className="w-5 h-5" />
          </button>

          {/* Share Button */}
          <button className="p-4 bg-gray-700/50 hover:bg-gray-600/50 rounded-full transition-colors">
            <Share className="w-5 h-5" />
          </button>

          {/* Leave Button */}
          <button className="p-4 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full transition-all duration-200">
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-sm font-medium">Recording • 00:00:00</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Room;