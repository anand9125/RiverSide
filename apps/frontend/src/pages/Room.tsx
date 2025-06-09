import { useEffect, useRef, useState } from 'react';
import { connectToServer, startWebcam } from './mediaSoup'
import { useRoomStore } from '../store/useRoomStror';

const Room = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [joined, setJoined] = useState(false);
  // const { createRoom } = useRoomStore()
  const [peerId, setPeerId] = useState(() => {
  const saved = localStorage.getItem('peerId');
  if (saved) return saved;
  const newId = crypto.randomUUID();
  localStorage.setItem('peerId', newId);
  return newId;
});

  let roomId="room 16";
    
 

const joinRoom = async () => {
  // roomId = await createRoom("Demo Room", new Date().toISOString());
  if (!roomId) return;
  await connectToServer(roomId, peerId, (remoteStream) => {  //Passing a callback function that will be executed when a remote media stream (video/audio) is received from another peer.
    //In this callback, you're assigning the remoteStream to the video element’s srcObject so the remote video appears on screen.
 if (remoteVideoRef.current) {
  remoteVideoRef.current.srcObject = remoteStream;

  remoteVideoRef.current.addEventListener('canplay', () => {
   console.log('Remote video track state:', remoteStream.getVideoTracks()[0].readyState);

    const promise = remoteVideoRef.current?.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          console.log('✅ Remote video playing!');
        })
        .catch((error) => {
          console.error('❌ Remote video play failed:', error);
        });
    }
  });
}



  });

  setJoined(true);
};
  const publishWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    console.log("local video ref",localVideoRef.current)
    console.log(roomId)
    if(roomId){
      console.log("roomId",roomId)
      console.log("going to start webcam")
     await startWebcam(roomId, peerId, stream);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🎙️ Riverside Clone (React + TS)</h2>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={joinRoom} disabled={joined}>
          Join Room
        </button>
        <button onClick={publishWebcam} disabled={!joined}>
          Publish Webcam
        </button>
      </div>
 <button onClick={() => {
  remoteVideoRef.current?.play().then(() => {
    console.log("✅ Manual play triggered");
  }).catch((e) => {
    console.error("❌ Manual play failed", e);
  });
}}>
  Force Remote Video Play
</button>




      <div style={{ display: 'flex', gap: '1rem' }}>
        <video ref={localVideoRef} autoPlay muted playsInline width={300} />
        <video
  ref={remoteVideoRef}
  autoPlay
  playsInline
  muted={false}
  style={{
    width: '400px',
    height: '300px',
    backgroundColor: 'black',
    border: '3px solid lime',
  }}
/>



       

      </div>
    </div>
  );
};

export default Room;


// //What call back used 
// User joins a room with roomId and peerId.

// connectToServer() sets up the signaling, transports, and consumers.

// When a remote producer (other peer) is found, the server sends info to this peer to create a consumer.

// When the consumer is created, you receive a track.

// That track is wrapped in a MediaStream, and the onRemoteStream callback is called.

// Your callback assigns this to the video element: