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
      send('join', { roomId, peerId });
    };
    socket.onmessage = async (event) => {
     const { type, data } = JSON.parse(event.data);

  // Handle direct promises
  if (pendingRequests.has(type)) {
    pendingRequests.get(type)!(data);
    pendingRequests.delete(type);
    return;
  }
  console.log("type",type)

  switch (type) {
      case 'joined':
        console.log(event.data);  
      send('getRouterRtpCapabilities', { roomId });
      
      // 👇 Add this
      if (data.existingProducers && data.existingProducers.length) {
        for (const prod of data.existingProducers) {
          await subscribeToPeer(roomId, peerId, prod.peerId, prod.label, onTrack);
        }
      }
      break;

    
    case 'routerRtpCapabilities':
      device = new mediasoupClient.Device();
      await device.load({ routerRtpCapabilities: data });
      resolve();
      break;

    case 'newProducer':
       console.log('New producer available', data);
      await subscribeToPeer(roomId, peerId, data.peerId, data.label, onTrack);
      break;

    case 'consumed':
       if (!recvTransport) {
    console.error('❌ recvTransport not ready');
    return;
  }
      const consumer = await recvTransport.consume({
        id: data.id,
        producerId: data.producerId,
        kind: data.kind,
        rtpParameters: data.rtpParameters,
      });
      console.log('Consumer track kind:', consumer.track.kind);
      console.log('Track enabled:', consumer.track.enabled);
      console.log('Track muted:', consumer.track.muted);


      consumers.set(consumer.id, consumer);
      const remoteStream = new MediaStream([consumer.track]);
      console.log('Remote track:', consumer.track);
      onTrack(remoteStream);
           console.log('Consumed:', data);
      send('resume', { roomId, peerId, consumerId: consumer.id });
      break;
  }
};

  });
}

export async function startWebcam(
  roomId: string,
  peerId: string,
  stream: MediaStream
) {
  const track = stream.getVideoTracks()[0];
   console.log(" i am going to create a transport")
  await createTransport(roomId, peerId, true);

  const producer = await sendTransport.produce({ track });
  producers.set('webcam', producer);
}

async function subscribeToPeer(
  roomId: string,
  peerId: string,
  remotePeerId: string,
  label: string,
  onTrack: Callback
) {
  if (!recvTransport) {
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
  console.log('Subscribing to', label, 'from', remotePeerId);

}

function send(type: string, data: any, expectResponseType?: string): Promise<any> | void {
  const message = JSON.stringify({ type, data });
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
  console.log("i am in create transport")
  const data = await send('createWebRtcTransport', { roomId, peerId }, 'createdTransport') as any;
  console.log("✅ i am in create transport", data);
 
  if (isSend) {
    sendTransport = device.createSendTransport(data);
    console.log("send transport we are ready to connecte webrtc trasnport",sendTransport)
    sendTransport.on('connect', ({ dtlsParameters }, callback) => {
      send('connectTransport', {
        roomId,
        peerId,
        transportId: sendTransport.id,
        dtlsParameters,
      });
      callback();
    });

    sendTransport.on('produce', async ({ kind, rtpParameters }, callback) => {
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
      console.log('Producing track...', kind);

    });
  } else {
   

    recvTransport = device.createRecvTransport(data);

    recvTransport.on('connect', ({ dtlsParameters }, callback) => {
      send('connectTransport', {
        roomId,
        peerId,
        transportId: recvTransport.id,
        dtlsParameters,
      });
      callback();
    });
  }
}
