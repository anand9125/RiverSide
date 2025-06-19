import { useEffect, useRef, useState } from 'react';
import { mediaSoupClient } from './mediasoup-cleint';
import { StreamInfo } from '../types/mediasoup';
import { mediaStore } from './mediaStore';

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
  

  //    Track all active producers in a map: { label: MediaStreamTrack }
  // On peerJoined, re-send each track with its label
  // On startWebcam / startScreenShare, add that track to the map
  //  Dynamic track registry: label -> track

  // Connect on mount
  useEffect(() => {
    const connect = async () => {
      try {
        await mediaSoupClient.connectToServer(roomId, peerId, handleRemoteStream);
        setIsConnected(true);
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
  const { stream } = streamInfo;
  const videoTrack = stream.getVideoTracks()[0];

  if (!videoTrack || videoTrack.readyState === 'ended') return;

  if (videoTrack.readyState === 'live') {
    setRemoteStreams((prev) => {
      const newMap = new Map(prev);
      newMap.set(streamInfo.peerId, streamInfo);
      return newMap;
    });
  } else {
    // Wait until the video track is live before updating state
    videoTrack.onunmute = () => {
      setRemoteStreams((prev) => {
        const newMap = new Map(prev);
        newMap.set(streamInfo.peerId, streamInfo);
        return newMap;
      });
    };
  }
};


  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } },
        audio: true,
      });

      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const [videoTrack] = stream.getVideoTracks();
      const [audioTrack] = stream.getAudioTracks();

      if (videoTrack) {
        await mediaSoupClient.produceTrack(roomId, peerId, videoTrack, 'cam');
        mediaStore.producerTrackMap.set('cam', videoTrack);
      }
      if (audioTrack){
        await mediaSoupClient.produceTrack(roomId, peerId, audioTrack, 'mic');
         mediaStore.producerTrackMap.set('mic', audioTrack);
      } 

    } catch (error) {
      console.error('❌ Webcam error:', error);
    }
  };

  const startScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await stopScreenShare();
        return;
      }

      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      if (!screenTrack) return;

      screenTrackRef.current = screenTrack;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      // Stop webcam before starting screen share and also deltee webcam
      if (localStream) {
        localStream.getVideoTracks().forEach(t => t.stop());
        mediaStore.producerTrackMap.delete('cam');
      }

      await mediaSoupClient.produceTrack(roomId, peerId, screenTrack, 'screen');
       mediaStore.producerTrackMap.set('screen', screenTrack);
      setIsScreenSharing(true);

      screenTrack.onended = stopScreenShare;

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
      mediaStore.producerTrackMap.delete('screen');
    setIsScreenSharing(false);
    await startWebcam();
  };

  const toggleMicrophone = (enabled: boolean) => {
    localStream?.getAudioTracks().forEach(track => (track.enabled = enabled));
   
  };

  const toggleCamera = (enabled: boolean) => {
    localStream?.getVideoTracks().forEach(track => (track.enabled = enabled));
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
