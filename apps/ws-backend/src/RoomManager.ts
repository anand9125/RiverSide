// server/roomManager.ts
import { Consumer, Producer, Router, Transport } from 'mediasoup/types';
import WebSocket from 'ws';

export class Peer {
  id: string;
  socket: WebSocket;
  roomId: string;
  transports = new Map<string, Transport>();
  producers = new Map<string, Producer>(); //Each producer might represent webcam, mic, or any custom media.

  consumers = new Map<string, Consumer>();

  constructor(id: string, socket: WebSocket, roomId: string) {
    this.id = id;
    this.socket = socket;
    this.roomId = roomId;
  }

addTransport(transport: Transport) {
  const transportId = transport.id;
  this.transports.set(transportId, transport);
}


  addProducer(label: string, producer: Producer) {
    this.producers.set(label, producer);
    const allProducers = [...this.producers.values()];
    console.log("allProducers",allProducers)

    


  
  }

  addConsumer(consumer: Consumer) {
    this.consumers.set(consumer.id, consumer);
  }

  close() {   //Closes all associated mediasoup resources when the peer disconnects.
    this.producers.forEach(p => p.close());
    this.transports.forEach(t => t.close());
    this.consumers.forEach(c => c.close());
  }
}

export class Room {
  id: string;
  router: Router;
  peers = new Map<string, Peer>();

  constructor(id: string, router: Router) {
    this.id = id;
    this.router = router;
  }

  addPeer(peerId: string, socket: WebSocket) {
    const peer = new Peer(peerId, socket, this.id);
    this.peers.set(peerId, peer);
    return peer;
  }
  getPeer(peerId:string){
    return this.peers.get(peerId);
  }
  getAllPeers(){
    return Array.from(this.peers.values());
  }

  removePeer(peerId: string) {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.close();
      this.peers.delete(peerId);
    }
  }

  broadcast(fromPeerId: string, type: string, data: any) {
    this.peers.forEach((peer, id) => {
      if (id !== fromPeerId) {
        peer.socket.send(JSON.stringify({ type, data }));
      }
    });
  }

  isEmpty() {
    return this.peers.size === 0;
  }
}

export const RoomManager = {
  rooms: new Map<string, Room>(),

  createRoom: async (roomId: string, router: Router) => {
    const room = new Room(roomId, router);
    RoomManager.rooms.set(roomId, room);
    return room;
  },

  getRoom: (roomId: string) => RoomManager.rooms.get(roomId),

  removeRoom: (roomId: string) => {
    const room = RoomManager.rooms.get(roomId);
    if (room) {
      room.peers.forEach((_, peerId) => room.removePeer(peerId));
      RoomManager.rooms.delete(roomId);
    }
  }
};



//why we are storing webRtc stuff in peer class
// because WebRTC and Mediasoup are stateful,   and a functioning SFU server must keep track of the signaling and media flow for each connected peer
//transports: Map<string, Transport>  :Represents the actual WebRTC connection for sending or receiving media.
//why we stroing it :  Each peer may have multiple transports (send and receive). These need to be:Closed manually when the peer disconnects 2.Accessed later for producing or consuming media  Example use: createSendTransport → save to peer → use later to create producer

//Producers: A Producer is a media stream (like webcam or screen) sent by a peer to the Mediasoup server If Alice shares her webcam:.Alice creates a SendTransport She attaches her webcam track to it   That becomes a Producer in Mediasoup 
//Why we store it:So other peers can consume it,So we can stop/pause/resume it,To close it cleanly on disconnect
//example use:When a new peer joins, the server finds all other producers in the room and creates Consumers for this new peer.

//Consumers:A Cons
// umer is a way for another peer to receive a media stream from Mediasoup.If Bob joins the room and wants to see Alice:Server already has Alice’s Producer Server creates a Consumer for Bob  Bob receives that video over his RecvTransport
//Why we store it:To resume/pause it on user demand,To close it when the peer disconnects,To re-negotiate if a producer restarts,Example use: When a peer subscribes to another’s producer, a Consumer is created and tracked.




//why we storing router in room class
//We store the router in the Room class because the mediasoup.Router is the central SFU component responsible for managing media routing within a specific room
//what is router =>A Router in mediasoup 1.Lives on a Worker 2.Manages RTP routing 3.Holds the RTP capabilities 4.Connects all transports, producers, and consumers

//why we store: Each Room needs its own media router (no sharing across rooms) =>If you're building an app like Riverside or Zoom, each meeting room needs: 1.Its own media routing  2.Its own participants 3.Independent control over transports/producers/consumers
// To create transports/producers/consumers =>These are all created via the router instance:
//To access router.rtpCapabilities

//why eaach room has its own router
//In mediasoup, a Router represents a media domain   it's the component that:Routes RTP packets between producers and consumers 2.Maintains media codec compatibility 3.Owns the RTP capabilities 4.Controls transports, producers, consumers

