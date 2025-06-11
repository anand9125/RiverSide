import * as mediasoupClient from 'mediasoup-client';

type Callback = (stream: MediaStream) => void;

let socket: WebSocket;
let device: mediasoupClient.types.Device;
let sendTransport: mediasoupClient.types.Transport;
let recvTransport: mediasoupClient.types.Transport;

const producers = new Map<string, mediasoupClient.types.Producer>();
const consumers = new Map<string, mediasoupClient.types.Consumer>();
const pendingRequests = new Map<string, (data: any) => void>();

export async function connectToServer(
  roomId: string,
  peerId: string,
  onTrack: Callback
): Promise<void> {
  return new Promise((resolve) => {
    socket = new WebSocket('ws://localhost:4000');

    socket.onopen = () => {
      console.log('✅ WebSocket connected');
      send('join', { roomId, peerId });
    };

    socket.onmessage = async (event) => {
      const { type, data } = JSON.parse(event.data);
      console.log('📨 Received message:', type, data);

      // Handle direct promises
      if (pendingRequests.has(type)) {
        pendingRequests.get(type)!(data);
        pendingRequests.delete(type);
        return;
      }

      switch (type) {
        case 'joined':
          console.log('✅ Joined room:', data);
          send('getRouterRtpCapabilities', { roomId });
          
          // Subscribe to existing producers
          if (data.existingProducers && data.existingProducers.length) {
            console.log('📺 Found existing producers:', data.existingProducers);
            for (const prod of data.existingProducers) {
              await subscribeToPeer(roomId, peerId, prod.peerId, prod.label, onTrack);
            }
          }
          break;

        case 'routerRtpCapabilities':
          console.log('🔧 Setting up device with RTP capabilities');
          device = new mediasoupClient.Device();
          await device.load({ routerRtpCapabilities: data });
          resolve();
          break;

        case 'newProducer':
          console.log('🆕 New producer available:', data);
          await subscribeToPeer(roomId, peerId, data.peerId, data.label, onTrack);
          break;

        case 'consumed':
          console.log('🎬 Consuming media:', data);
          if (!recvTransport) {
            console.error('❌ recvTransport not ready');
            return;
          }

          try {
            const consumer = await recvTransport.consume({
              id: data.id,
              producerId: data.producerId,
              kind: data.kind,
              rtpParameters: data.rtpParameters,
            });

            console.log('✅ Consumer created:', {
              id: consumer.id,
              kind: consumer.kind,
              trackEnabled: consumer.track.enabled,
              trackMuted: consumer.track.muted,
              trackReadyState: consumer.track.readyState
            });

            consumers.set(consumer.id, consumer);
            
            // Create MediaStream and add track
            const remoteStream = new MediaStream([consumer.track]);
            console.log('📺 Remote stream created with tracks:', remoteStream.getTracks().length);
            
            // Resume consumer immediately after creation
            send('resume', { roomId, peerId, consumerId: consumer.id });
            
            // Call onTrack callback
            onTrack(remoteStream);
            
          } catch (error) {
            console.error('❌ Failed to consume:', error);
          }
          break;

        case 'resumed':
          console.log('▶️ Consumer resumed');
          break;
      }
    };

    socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket disconnected');
    };
  });
}

export async function startWebcam(
  roomId: string,
  peerId: string,
  stream: MediaStream
) {
  console.log('📹 Starting webcam...');
  const track = stream.getVideoTracks()[0];
  
  if (!track) {
    console.error('❌ No video track found');
    return;
  }

  console.log('🔧 Creating send transport...');
  await createTransport(roomId, peerId, true);

  console.log('📤 Producing video track...');
  const producer = await sendTransport.produce({ track });
  producers.set('webcam', producer);
  
  console.log('✅ Producer created:', producer.id);
}

async function subscribeToPeer(
  roomId: string,
  peerId: string,
  remotePeerId: string,
  label: string,
  onTrack: Callback
) {
  console.log(`🔗 Subscribing to ${label} from ${remotePeerId}`);
  
  if (!recvTransport) {
    console.log('🔧 Creating receive transport...');
    await createTransport(roomId, peerId, false);
  }

  send('consume', {
    roomId,
    peerId,
    transportId: recvTransport.id,
    remotePeerId,
    rtpCapabilities: device.rtpCapabilities,
    label,
  });
}

function send(type: string, data: any, expectResponseType?: string): Promise<any> | void {
  const message = JSON.stringify({ type, data });
  console.log('📤 Sending:', type, data);
  socket.send(message);
  
  if (expectResponseType) {
    return new Promise((resolve) => {
      pendingRequests.set(expectResponseType, resolve);
    });
  }
}

async function createTransport(
  roomId: string,
  peerId: string,
  isSend: boolean
): Promise<void> {
  console.log(`🚛 Creating ${isSend ? 'send' : 'receive'} transport...`);
  
  const data = await send('createWebRtcTransport', { roomId, peerId }, 'createdTransport') as any;
  console.log('✅ Transport created with params:', data);
 
  if (isSend) {
    sendTransport = device.createSendTransport(data);
    
    sendTransport.on('connect', ({ dtlsParameters }, callback) => {
      console.log('🔗 Send transport connecting...');
      send('connectTransport', {
        roomId,
        peerId,
        transportId: sendTransport.id,
        dtlsParameters,
      });
      callback();
    });

    sendTransport.on('produce', async ({ kind, rtpParameters }, callback) => {
      console.log('📤 Producing:', kind);
      const res = await send(
        'produce',
        {
          roomId,
          peerId,
          transportId: sendTransport.id,
          kind,
          rtpParameters,
          label: 'webcam',
        },
        'produced'
      );
      callback({ id: res.id });
    });

    sendTransport.on('connectionstatechange', (state) => {
      console.log('📡 Send transport state:', state);
    });

  } else {
    recvTransport = device.createRecvTransport(data);

    recvTransport.on('connect', ({ dtlsParameters }, callback) => {
      console.log('🔗 Receive transport connecting...');
      send('connectTransport', {
        roomId,
        peerId,
        transportId: recvTransport.id,
        dtlsParameters,
      });
      callback();
    });

    recvTransport.on('connectionstatechange', (state) => {
      console.log('📡 Receive transport state:', state);
    });
  }
}