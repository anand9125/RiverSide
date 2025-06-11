import ws from 'ws';
import { Peer, RoomManager } from './RoomManager';
import { createMediasoupWorker, createRouter, createWebRtpTranport } from './mediasoupUtils';
import { Router, Worker } from 'mediasoup/types';

type AppData = Record<string, any>;
let worker: Worker;
let router: Router;

export const mediaSoupServer = async (wss: ws.Server) => {
  worker = await createMediasoupWorker();

  wss.on('connection', async (ws) => {
    console.log('🔌 New WebSocket connection');

    ws.on('message', async (message: string) => {
      try {
        if (!isJsonString(message)) return console.log('Invalid JSON');
        const event = JSON.parse(message.toString());
        console.log('📨 Received:', event.type, event.data);

        switch (event.type) {
          case 'join':
            await handleJoinRoom(event.data, ws);
            break;

          case "getRouterRtpCapabilities":
            const r = RoomManager.getRoom(event.data.roomId);
            if (r) {
              console.log('📡 Sending RTP capabilities');
              ws.send(JSON.stringify({ 
                type: 'routerRtpCapabilities', 
                data: r.router.rtpCapabilities 
              }));
            }
            break;

          case "createWebRtcTransport":
            await handleCreateWebRtcTransport(event.data, ws);
            break;

          case "connectTransport":
            await handleConnectWebRtcTransport(event.data, ws);
            break;

          case "produce":
            await handleProduce(event.data, ws);
            break;

          case "consume":
            await handleConsume(event.data, ws);
            break;

          case "resume":
            await handleResume(event.data, ws);
            break;

          case "leave":
            await handleLeave(event.data, ws);
            break;
        }
      } catch (err) {
        console.error('❌ Error handling message:', err);
      }
    });

    ws.on('close', () => {
      console.log('🔌 WebSocket connection closed');
    });
  });
}

function isJsonString(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (err) {
    return false;
  }
}

function send(ws: ws, type: string, data: any) {
  const message = JSON.stringify({ type, data });
  console.log('📤 Sending:', type, data);
  ws.send(message);
}

async function handleJoinRoom(data: any, ws: ws) {
  const { roomId, peerId } = data;
  console.log(`🚪 ${peerId} joining room ${roomId}`);
  
  let room = RoomManager.getRoom(roomId);
  if (!room) {
    console.log('🏗️ Creating new room and router');
    router = await createRouter(worker);
    room = await RoomManager.createRoom(roomId, router);
  }

  room.addPeer(peerId, ws);
  console.log('👥 All peers in room:', Array.from(room.peers.keys()));

  const existingProducers = [];
  for (const [id, peer] of room.peers) {
    if (id !== peerId) {
      for (const [label, producer] of peer.producers) {
        existingProducers.push({
          peerId: id,
          producerId: producer.id,
          kind: producer.kind,
          label,
        });
      }
    }
  }

  console.log('📺 Existing producers:', existingProducers);
  send(ws, 'joined', {
    roomId,
    peerId,
    existingProducers,
  });
}

async function handleCreateWebRtcTransport(data: any, ws: ws) {
  const { roomId, peerId } = data;
  console.log(`🚛 Creating transport for ${peerId}`);
  
  const roomForTransport = RoomManager.getRoom(roomId);
  const peerForTransport = roomForTransport?.getPeer(peerId);

  if (!peerForTransport || !roomForTransport) {
    console.error('❌ Room or peer not found for transport creation');
    return;
  }

  try {
    const { transport, params } = await createWebRtpTranport(roomForTransport.router);
    peerForTransport.addTransport(transport);
    
    console.log('✅ Transport created:', transport.id);
    send(ws, 'createdTransport', params);
  } catch (error) {
    console.error('❌ Failed to create transport:', error);
  }
}

async function handleConnectWebRtcTransport(data: any, ws: ws) {
  const { roomId, peerId, transportId, dtlsParameters } = data;
  console.log(`🔗 Connecting transport ${transportId} for ${peerId}`);
  
  const roomConnect = RoomManager.getRoom(roomId);
  const peerConnect = roomConnect?.getPeer(peerId);
  const transport = peerConnect?.transports.get(transportId);
  
  if (!transport) {
    console.error('❌ Transport not found for connection');
    return;
  }

  try {
    await transport.connect({ dtlsParameters });
    console.log('✅ Transport connected:', transportId);
  } catch (error) {
    console.error('❌ Failed to connect transport:', error);
  }
}

async function handleProduce(data: any, ws: ws) {
  const { roomId, peerId, transportId, kind, rtpParameters, label } = data;
  console.log(`📤 Producing ${kind} for ${peerId} with label ${label}`);
  
  const roomProduce = RoomManager.getRoom(roomId);
  const peerProduce = roomProduce?.getPeer(peerId);
  const prodTransport = peerProduce?.transports.get(transportId);

  if (!prodTransport) {
    console.error('❌ Producer transport not found');
    return;
  }

  try {
    const producer = await prodTransport.produce({
      kind,
      rtpParameters,
    });

    peerProduce?.addProducer(label, producer);
    console.log(`✅ Producer created: ${producer.id} for ${peerId} [${label}]`);

    // Notify other peers about new producer
    roomProduce?.broadcast(peerId, 'newProducer', { peerId, label });
    send(ws, 'produced', { id: producer.id });
  } catch (error) {
    console.error('❌ Failed to produce:', error);
  }
}

async function handleConsume(data: any, ws: ws) {
  const { roomId, peerId, transportId, remotePeerId, rtpCapabilities, label } = data;
  console.log(`🎬 ${peerId} consuming ${label} from ${remotePeerId}`);

  const room = RoomManager.getRoom(roomId);
  if (!room) {
    console.error(`❌ Room ${roomId} not found`);
    return;
  }

  const peer = room.getPeer(peerId);
  const remotePeer = room.getPeer(remotePeerId);

  if (!peer || !remotePeer) {
    console.error('❌ Peer not found for consumption');
    return;
  }

  const consumeTransport = peer.transports.get(transportId);
  if (!consumeTransport) {
    console.error(`❌ Transport ${transportId} not found`);
    return;
  }

  const remoteProducer = remotePeer.producers.get(label);
  if (!remoteProducer) {
    console.error(`❌ Producer "${label}" not found for ${remotePeerId}`);
    return;
  }

  try {
    // Check if router can consume
    if (!room.router.canConsume({
      producerId: remoteProducer.id,
      rtpCapabilities,
    })) {
      console.error('❌ Cannot consume - RTP capabilities mismatch');
      return;
    }

    const consumer = await consumeTransport.consume({
      producerId: remoteProducer.id,
      rtpCapabilities,
      paused: true, // Start paused, will be resumed later
    });

    console.log(`✅ Consumer created: ${consumer.id} for producer ${remoteProducer.id}`);
    peer.addConsumer(consumer);

    send(ws, 'consumed', {
      id: consumer.id,
      producerId: remoteProducer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      label,
    });
  } catch (err) {
    console.error(`❌ Failed to consume:`, err);
  }
}

async function handleResume(data: any, ws: ws) {
  const { roomId, peerId, consumerId } = data;
  console.log(`▶️ Resuming consumer ${consumerId} for ${peerId}`);
  
  const consumerPeer = RoomManager.getRoom(roomId)?.getPeer(peerId);
  const targetConsumer = consumerPeer?.consumers.get(consumerId);
  
  if (!targetConsumer) {
    console.error('❌ Consumer not found for resume');
    return;
  }

  try {
    await targetConsumer.resume();
    console.log('✅ Consumer resumed:', consumerId);
    send(ws, 'resumed', {});
  } catch (error) {
    console.error('❌ Failed to resume consumer:', error);
  }
}

async function handleLeave(data: any, ws: ws) {
  const { roomId, peerId } = data;
  console.log(`🚪 ${peerId} leaving room ${roomId}`);
  
  const leaveRoom = RoomManager.getRoom(roomId);
  leaveRoom?.removePeer(peerId);
  
  if (leaveRoom?.isEmpty()) {
    console.log(`🗑️ Removing empty room ${roomId}`);
    RoomManager.removeRoom(roomId);
  }
  
  send(ws, 'left', {});
}