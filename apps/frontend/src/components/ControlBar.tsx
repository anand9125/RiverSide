import React from 'react';
import { Video, VideoOff, Mic, MicOff, Volume2, VolumeX, Share, FileText, PhoneOff, SwordIcon as Record, Pause } from 'lucide-react';
import { useRecordingManager } from './RecordingControll';

interface ControlBarProps {
  isRecording: boolean;
  isMicOn: boolean;
  isCameraOn: boolean;
  isSpeakerOn: boolean;
  isScreenSharing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleSpeaker: () => void;
  onToggleScreenShare: () => void;
  onLeave: () => void;
}



export function ControlBar({
  isRecording, //boolean  State Flags
  isMicOn,
  isCameraOn,
  isSpeakerOn,
  isScreenSharing,
  onStartRecording,  //Callback Functions (Event Handlers)  These are functions that will be called when a user interacts with the ControlBar, such as clicking a button
  onStopRecording,
  onToggleMic,
  onToggleCamera,
  onToggleSpeaker,
  onToggleScreenShare,
  onLeave,
}: ControlBarProps) {
  return (
    <div className="border-t border-gray-700/50 p-6">
      <div className="flex items-center justify-center space-x-4">
        {/* Record Button */}
       {
        isRecording ?   <button
          onClick={onStopRecording}
          className={`flex items-center space-x-3 px-6 py-3 rounded-full font-medium transition-all duration-200 
             'bg-red-500 hover:bg-red-600 text-white' 
          `}
        >
          <Pause className="w-5 h-5" />
          <span>Stop</span>
        </button>: <button
          onClick={onStartRecording}
          className={`flex items-center space-x-3 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
             'bg-gray-700/50 hover:bg-red-500/20 hover:text-red-400'
          }`}
        >
           <Record className="w-5 h-5" />
          <span>Record</span>
        </button>
       }
       
        {/* <button
          onClick={onToggleRecording}
          className={`flex items-center space-x-3 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gray-700/50 hover:bg-red-500/20 hover:text-red-400'
          }`}
        >
          {isRecording ? <Pause className="w-5 h-5" /> : <Record className="w-5 h-5" />}
          <span>{isRecording ? 'Stop' : 'Record'}</span>
        </button> */}

        {/* Mic Button */}
        <button
          onClick={onToggleMic}
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
          onClick={onToggleCamera}
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
          onClick={onToggleSpeaker}
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

        {/* Share Screen Button */}
        <button 
          onClick={onToggleScreenShare}
          className={`p-4 rounded-full transition-colors ${
            isScreenSharing 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-700/50 hover:bg-gray-600/50 text-white'
          }`}
        >
          <Share className="w-5 h-5" />
        </button>

        {/* Leave Button */}
        <button 
          onClick={onLeave}
          className="p-4 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full transition-all duration-200"
        >
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
  );
}