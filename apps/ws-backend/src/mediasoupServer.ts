import ws from 'ws';
import { Peer, RoomManager } from './RoomManager';
import { createMediasoupWorker, createRouter, createWebRtpTranport } from './mediasoupUtils';
import { Router, Worker } from 'mediasoup/types';
type AppData = Record<string, any>;
 let worker:Worker;
 let router:Router;

export const mediaSoupServer = async(wss: ws.Server) => {
      worker = await createMediasoupWorker();
    


    wss.on('connection',async (ws) => {

        

        ws.on('message',async (message:string) => {
            
            try{
                if (!isJsonString(message)) return console.log('Invalid JSON');
                const event = JSON.parse(message.toString());

                switch (event.type) {
                    case 'join':
                        await handleJoinRoom(event.data,ws);
                        break;
                        
                    case "getRouterRtpCapabilities":
                        const r = RoomManager.getRoom(event.data.roomId);
                        if (r) {
                           
                            ws.send(JSON.stringify({ type: 'routerRtpCapabilities', data: r.router.rtpCapabilities }));
                        }
                        break;
                    case  "createWebRtcTransport":
                        await handleCreateWebRtcTransport(event.data,ws);
                        break;
                    case  "connectWebRtcTransport": 
                        await handleConnectWebRtcTransport(event.data,ws);
                        
                        break;
                    case  "produce":
                        await handleProduce(event.data,ws);
                        break;
                    case  "consume":
                        await handleConsume(event.data,ws);
                        break;
                    case  "resume":
                        await handleResume(event.data,ws);
                        break;
                    case "leave":
                        await handleLeave(event.data,ws);
                    }
                        

            }catch(err){
                console.log(err);
            }
         
        }
    );
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
  ws.send(message);
}

async function handleJoinRoom(data: any, ws: ws) {
  const { roomId, peerId } = data;
  let room = RoomManager.getRoom(roomId);
  if (!room) {
    router = await createRouter(worker);
    room = await RoomManager.createRoom(roomId, router);
  }

  room.addPeer(peerId, ws);
const peerForTransport = room?.getPeer(peerId);
  console.log('All peers in room:', Array.from(room.peers.keys()));


  const existingProducers = [];
  for (const [id, peer] of room.peers) {  //Loops through all peers in the room
    if (id !== peerId) {   //We skip the current joining peer
      for (const [label, producer] of peer.producers) {  //Each peer has a producers map:
        // We now loop over each producer that this peer owns.because each peer can have multiple producers like webcan or screecshare or audio
        existingProducers.push({
          peerId: id,
          producerId: producer.id,
          kind: producer.kind,
          label,
        });
      }
    }
  }

  send(ws, 'joined', {
    roomId,
    peerId,
    existingProducers, //  send all existing producers for late subscription
  });
}


async function handleCreateWebRtcTransport(data:any,ws:ws){
   
  
    const roomForTransport = RoomManager.getRoom(data.roomId);
    const peerForTransport = roomForTransport?.getPeer(data.peerId);
 
    if(!peerForTransport && !roomForTransport){
        return;
    }
    const {transport,params} = await createWebRtpTranport(router);
;
     peerForTransport?.addTransport(transport);
  
   send(ws, 'createdTransport', params);
}

async function handleConnectWebRtcTransport(data:any,ws:ws){
    const{roomId,peerId,transportId,dtlsParameters} = data;
    const roomConnect = RoomManager.getRoom(roomId);
    const peerConnect = roomConnect?.getPeer(peerId);
    const transport = peerConnect?.transports.get(transportId);
    if(!transport){
        return;
    }
    await transport.connect({dtlsParameters});
    send(ws,'producerTransportConnected',{});
}

async function handleProduce(data:any,ws:ws){

    const{roomId,peerId,transportId,kind,rtpParameters,label} = data;
    const roomProduce = RoomManager.getRoom(roomId);
    const peerProduce = roomProduce?.getPeer(peerId);
    const prodTransport = peerProduce?.transports.get(transportId);
   
    if(!prodTransport){
    
        return;
    }
    
    const producer = await prodTransport.produce({
        kind,
        rtpParameters,
    });
    
    peerProduce?.addProducer(label,producer);
    console.log(`Added producer for ${peerId} [${label}]: ${producer.id}`);
    console.log("hii this is label",peerProduce?.producers.get(label))
   
    roomProduce?.broadcast(peerId,'newProducer',{peerId,label});
    send(ws,'produced',{id:producer.id});
   

}
async function handleConsume(data: any, ws: ws) {
  const { roomId, peerId, transportId, remotePeerId, rtpCapabilities, label } = data;

  console.log(`handleConsume called by ${peerId} for remote peer ${remotePeerId}, label=${label}`);

  const room = RoomManager.getRoom(roomId);
  if (!room) {
    console.error(`Room ${roomId} not found`);
    return;
  }

  const peer = room.getPeer(peerId);
  const remotePeer = room.getPeer(remotePeerId);

  if (!peer) {
    console.error(`Peer ${peerId} not found in room ${roomId}`);
    return;
  }

  if (!remotePeer) {
    console.error(`Remote peer ${remotePeerId} not found`);
    return;
  }

  const consumeTransport = peer.transports.get(transportId);
  if (!consumeTransport) {
    console.error(`Transport ${transportId} not found for peer ${peerId}`);
    return;
  }

  const remoteProducer = remotePeer.producers.get(label);
  if (!remoteProducer) {
    console.error(`Producer with label "${label}" not found for remote peer ${remotePeerId}`);
    return;
  }

  try {
    const consumer = await consumeTransport.consume({
      producerId: remoteProducer.id,
      rtpCapabilities,
      paused: true,
    });

    console.log(`✅ Consuming from remote peer ${remotePeerId}, label=${label}, producerId=${remoteProducer.id}`);
    peer.addConsumer(consumer);

    send(ws, 'consumed', {
      id: consumer.id,
      producerId: remoteProducer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      label,
    });

    // Notify others about this new consumer
    room.broadcast(peerId, 'newConsumer', { peerId, label });
  } catch (err) {
    console.error(`❌ Failed to consume from producer ${remoteProducer.id}:`, err);
  }
}

// async function handleConsume(data:any,ws:ws){
//     const{roomId,peerId,transportId,remotePeerId,rtpCapabilities,label} = data;
//     const roomConsume = RoomManager.getRoom(roomId);
//     const peerConsume = roomConsume?.getPeer(peerId);
//     const consumeTransport = peerConsume?.transports.get(transportId);
//     const remotePeer = roomConsume?.getPeer(remotePeerId);
//     const remoteProducer = remotePeer?.producers.get(label);
//     if (!remoteProducer || !consumeTransport) return;

//     const consumer = await consumeTransport.consume({
//         producerId: remoteProducer.id,
//         rtpCapabilities,
//         paused: true,
//     });
//     console.log('Consuming from', remotePeerId, 'label:', label);
// console.log('Producer:', !!remoteProducer, 'Transport:', !!consumeTransport);

//     peerConsume?.addConsumer(consumer);
//     send(ws,'consumed',
//         {
//             id: consumer.id,
//             producerId: remoteProducer.id,
//             kind: consumer.kind,
//             rtpParameters: consumer.rtpParameters,
//         }
//     );
//     roomConsume?.broadcast(peerId,'newConsumer',{peerId,label});
// }

async function handleResume(data:any,ws:ws){
    const{roomId,peerId,transportId,consumerId} = data;
    const consumerPeer = RoomManager.getRoom(roomId)?.getPeer(peerId);
    const targetConsumer = consumerPeer?.consumers.get(consumerId);
    await targetConsumer?.resume();
    send(ws,'resumed',{});
}

async function handleLeave(data:any,ws:ws){
    const{roomId,peerId} = data;
    const leaveRoom = RoomManager.getRoom(roomId);
    leaveRoom?.removePeer(peerId);
    if(leaveRoom?.isEmpty()){
        RoomManager.removeRoom(roomId);
    }
    send(ws,'left',{});
}