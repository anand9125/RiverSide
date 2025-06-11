import { useEffect, useRef, useState } from 'react';
import { connectToServer, startWebcam } from './mediaSoup'
import { useRoomStore } from '../store/useRoomStror';


const Testroom = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [joined, setJoined] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [remoteStreamReady, setRemoteStreamReady] = useState(false);
//  const {createRoom,isLoading} = useRoomStore()
// const [roomId, setRoomId] = useState<string | null>(null);
  const userData = localStorage.getItem("userData")
  const peerId = userData ? JSON.parse(userData).id :null;
  console.log(peerId)
  const roomId = "room 16"
  const date = new Date().toISOString();
    // const roomId = await createRoom('test', `${date}`,`${peerId}`);
   
  const joinRoom = async () => {
    try {
     // eslint-disable-next-line
      // if(roomId){
      //      setRoomId(roomId)
      //      localStorage.setItem("roomId",roomId)
      // }
      
      await connectToServer(roomId!, peerId, (remoteStream) => {
        
        if (remoteVideoRef.current) {
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

      setJoined(true);
      console.log('Successfully joined room');
    } catch (error) {
      console.error(' Failed to join room:', error);
    }
  };

  const publishWebcam = async () => {
    try {
      setIsPublishing(true);
      console.log('📹 Getting user media...');
      
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

      console.log(' Starting webcam stream...');
      
      await startWebcam(roomId!, peerId, stream);
      console.log(' Webcam published successfully');
      
    } catch (error) {
      console.error(' Failed to publish webcam:', error);
    } finally {
      setIsPublishing(false);
    }
  };

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

  return (
    <div style={{ padding: '20px' }}>
      <h2>🎙️ Riverside Clone (React + TS)</h2>
      
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={joinRoom} disabled={joined}>
          {joined ? ' Joined' : 'Join Room'}
        </button>
        
        <button onClick={publishWebcam} disabled={!joined || isPublishing}>
          {isPublishing ? '📹 Publishing...' : 'Publish Webcam'}
        </button>
        
        <button onClick={forcePlay} disabled={!remoteStreamReady}>
          🎬 Force Play Remote
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p>Status: {joined ? '🟢 Connected' : '🔴 Disconnected'}</p>
        <p>Remote Stream: {remoteStreamReady ? '🟢 Ready' : '🔴 Not Ready'}</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h3>Local Video</h3>
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline 
            width={300}
            style={{ border: '2px solid blue', backgroundColor: 'black' }}
          />
        </div>
        
        <div>
          <h3>Remote Video</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted={false}
            controls
            style={{
              width: '400px',
              height: '300px',
              backgroundColor: 'black',
              border: remoteStreamReady ? '3px solid lime' : '3px solid red',
            }}
          />
        </div>
      </div>
    </div>
  );
};

 export default Testroom