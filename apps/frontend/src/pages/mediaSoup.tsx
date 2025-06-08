import * as mediasoupClient from 'mediasoup-client';

type Callback = (stream: MediaStream) => void;

let socket: WebSocket;
let device: mediasoupClient.types.Device;
let sendTransport: mediasoupClient.types.Transport;
let recvTransport: mediasoupClient.types.Transport;

const producers = new Map<string, mediasoupClient.types.Producer>();
const consumers = new Map<string, mediasoupClient.types.Consumer>();

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

      switch (type) {
        case 'joined':
          send('getRouterRtpCapabilities', { roomId });
          break;

        case 'routerRtpCapabilities':
          device = new mediasoupClient.Device();
          await device.load({ routerRtpCapabilities: data });
          resolve();
          break;

        case 'newProducer':
          subscribeToPeer(roomId, peerId, data.peerId, data.label, onTrack);
          break;

        case 'consumed':
          const consumer = await recvTransport.consume({
            id: data.id,
            producerId: data.producerId,
            kind: data.kind,
            rtpParameters: data.rtpParameters,
          });

          consumers.set(consumer.id, consumer);

          const remoteStream = new MediaStream([consumer.track]);
          onTrack(remoteStream);

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
  await createTransport(roomId, peerId, false);

  recvTransport.on('connect', ({ dtlsParameters }, callback) => {
    send('connectTransport', {
      roomId,
      peerId,
      transportId: recvTransport.id,
      dtlsParameters,
    });
    callback();
  });

  send('consume', {
    roomId,
    peerId,
    transportId: recvTransport.id,
    remotePeerId,
    rtpCapabilities: device.rtpCapabilities,
    label,
  });
}

function send(type: string, data: any) {
  socket.send(JSON.stringify({ type, data }));
}

async function createTransport(
  roomId: string,
  peerId: string,
  isSend: boolean
): Promise<void> {
  return new Promise((resolve) => {
    send('createWebRtcTransport', { roomId, peerId });

    socket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);

      if (type === 'createdTransport') {
        if (isSend) {
          sendTransport = device.createSendTransport(data);

          sendTransport.on('connect', ({ dtlsParameters }, callback) => {
            send('connectTransport', {
              roomId,
              peerId,
              transportId: sendTransport.id,
              dtlsParameters,
            });
            callback();
          });

          sendTransport.on(
            'produce',
            ({ kind, rtpParameters }, callback) => {
              send('produce', {
                roomId,
                peerId,
                transportId: sendTransport.id,
                kind,
                rtpParameters,
                label: 'webcam',
              });

              socket.onmessage = (event) => {
                const res = JSON.parse(event.data);
                if (res.type === 'produced') {
                  callback({ id: res.data.id });
                  resolve();
                }
              };
            }
          );
        } else {
          recvTransport = device.createRecvTransport(data);
          resolve();
        }
      }
    };
  });
}
