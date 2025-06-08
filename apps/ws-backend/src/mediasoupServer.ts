import ws from 'ws';
import { RoomManager } from './RoomManager';
import { createMediasoupWorker, createRouter, createWebRtpTranport } from './mediasoupUtils';
import { Router } from 'mediasoup/types';
type AppData = Record<string, any>;

let router:Router;


export const mediaSoupServer = async(wss: ws.Server) => {
     let worker = await createMediasoupWorker();
    


    wss.on('connection',async (ws) => {

        router = await createRouter(worker);

        ws.on('message',async (message:string) => {
            console.log(message.toString());
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
                    case  "consume":
                        await handleConsume(event.data,ws);
                        break;

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

async function handleJoinRoom(data: any,ws:ws) {
    const { roomId, peerId } = data;
    let room = RoomManager.getRoom(roomId);
    if (!room){
     room = await RoomManager.createRoom(roomId,router);
    }
    room.addPeer(peerId,ws);
    send(ws,'joined',{roomId,peerId});
}

async function handleCreateWebRtcTransport(data:any,ws:ws){
    const roomForTransport = RoomManager.getRoom(data.roomId);
    const peerForTransport = roomForTransport?.getPeer(data.peerId);
    if(!peerForTransport && !roomForTransport){
        return;
    }
    const {transport,params} = await createWebRtpTranport(router);
    peerForTransport?.addTransport(transport);
   send(ws, 'producerTransportCreated', params);
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
    roomProduce?.broadcast(peerId,'newProducer',{peerId,label});
    send(ws,'produced',{id:producer.id});
}

async function handleConsume(data:any,ws:ws){
    const{roomId,peerId,transportId,remotePeerId,rtpCapabilities,label} = data;
    const roomConsume = RoomManager.getRoom(roomId);
    const peerConsume = roomConsume?.getPeer(peerId);
    const consumeTransport = peerConsume?.transports.get(transportId);
    const remotePeer = roomConsume?.getPeer(remotePeerId);
    const remoteProducer = remotePeer?.producers.get(label);
    if (!remoteProducer || !consumeTransport) return;

    const consumer = await consumeTransport.consume({
        producerId: remoteProducer.id,
        rtpCapabilities,
        paused: true,
    });
    peerConsume?.addConsumer(consumer);
    send(ws,'consumed',
        {
            id: consumer.id,
            producerId: remoteProducer.id,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
        }
    );
    roomConsume?.broadcast(peerId,'newConsumer',{peerId,label});
}