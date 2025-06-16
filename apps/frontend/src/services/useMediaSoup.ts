import { useEffect, useRef, useState } from 'react';
import { mediaSoupClient } from './mediasoup-cleint';
import { StreamInfo } from '../types/mediasoup';

interface UseMediaSoupProps {
  roomId: string;
  peerId: string;
}

export function useMediaSoup({ roomId, peerId }: UseMediaSoupProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, StreamInfo>>(new Map());
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    const connect = async () => {
      try {
        await mediaSoupClient.connectToServer(roomId, peerId, handleRemoteStream);
        setIsConnected(true);
        
        // Start webcam
        await startWebcam();
      } catch (error) {
        console.error('❌ Failed to connect:', error);
      }
    };

    connect();

    return () => {
      mediaSoupClient.disconnect();
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomId, peerId]);

  const handleRemoteStream = (streamInfo: StreamInfo) => {
    console.log('📺 Remote stream received:', streamInfo);
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      const key = `${streamInfo.peerId}-${streamInfo.label}`;
      newMap.set(key, streamInfo);
      return newMap;
    });
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        },
        audio: true,
      });

      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      if (videoTrack) {
        await mediaSoupClient.produceTrack(roomId, peerId, videoTrack, 'cam');
      }

      if (audioTrack) {
        await mediaSoupClient.produceTrack(roomId, peerId, audioTrack, 'mic');
      }

      console.log('📹 Webcam started successfully');
    } catch (error) {
      console.error('❌ Failed to start webcam:', error);
    }
  };

  const startScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await stopScreenShare();
        return;
      }

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const screenTrack = screenStream.getVideoTracks()[0];
      if (!screenTrack) return;

      screenTrackRef.current = screenTrack;

      // Replace local video with screen share
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      await mediaSoupClient.produceTrack(roomId, peerId, screenTrack, 'screen');
      setIsScreenSharing(true);

      screenTrack.onended = async () => {
        await stopScreenShare();
      };

      console.log('🖥️ Screen share started');
    } catch (error) {
      console.error('❌ Screen share error:', error);
    }
  };

  const stopScreenShare = async () => {
    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
    }

    await mediaSoupClient.stopProducing('screen', roomId, peerId);
    setIsScreenSharing(false);

    // Switch back to webcam
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }

    console.log('🛑 Screen share stopped');
  };

  const toggleMicrophone = async (enabled: boolean) => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = enabled;
      }
    }
  };

  const toggleCamera = async (enabled: boolean) => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = enabled;
      }
    }
  };

  return {
    isConnected,
    localVideoRef,
    remoteStreams,
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
    toggleMicrophone,
    toggleCamera,
  };
}