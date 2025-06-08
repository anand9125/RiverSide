import { useRef, useState } from 'react';
import { connectToServer, startWebcam } from './mediaSoup'

const Room = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [joined, setJoined] = useState(false);

  const peerId = crypto.randomUUID();
  const roomId = 'demo-room';

  const joinRoom = async () => {
    await connectToServer(roomId, peerId, (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
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

    await startWebcam(roomId, peerId, stream);
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
      <div style={{ display: 'flex', gap: '1rem' }}>
        <video ref={localVideoRef} autoPlay muted playsInline width={300} />
        <video ref={remoteVideoRef} autoPlay playsInline width={300} />
      </div>
    </div>
  );
};

export default Room;
