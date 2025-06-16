import * as mediasoupClient from 'mediasoup-client';
import { MediaSoupState, TrackCallback, PeerStreams } from '../types/mediasoup';

class MediaSoupClient {
  private state: MediaSoupState = {
    socket: null,
    device: null,
    sendTransport: null,
    recvTransport: null,
    producers: new Map(),
    consumers: new Map(),
    peerStreams: new Map(),
  };

  private pendingRequests = new Map<string, (data: any) => void>();
  private onTrackCallback: TrackCallback | null = null;

  async connectToServer(roomId: string, peerId: string, onTrack: TrackCallback): Promise<void> {
    this.onTrackCallback = onTrack;
    
    return new Promise((resolve, reject) => {
      this.state.socket = new WebSocket('ws://localhost:4000');

      this.state.socket.onopen = () => {
        console.log('✅ WebSocket connected');
        this.send('join', { roomId, peerId });
      };

      this.state.socket.onmessage = async (event) => {
        const { type } = JSON.parse(event.data);
        try {
          const { type, data } = JSON.parse(event.data);
          console.log('📨 Received message:', type, data);

          // Handle pending promises
          if (this.pendingRequests.has(type)) {
            this.pendingRequests.get(type)!(data);
            this.pendingRequests.delete(type);
            return;
          }

          await this.handleMessage(type, data, roomId, peerId);
          
          if (type === 'routerRtpCapabilities') {
            resolve();
          }
        } catch (error) {
          console.error('❌ Error handling message:', error);
          if (type === 'routerRtpCapabilities') {
            reject(error);
          }
        }
      };

      this.state.socket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        reject(error);
      };

      this.state.socket.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.cleanup();
      };
    });
  }

  private async handleMessage(type: string, data: any, roomId: string, peerId: string): Promise<void> {
    switch (type) {
      case 'joined':
        console.log('✅ Joined room:', data);
        this.send('getRouterRtpCapabilities', { roomId });
        
        // Subscribe to existing producers
        if (data.existingProducers?.length) {
          console.log('📺 Found existing producers:', data.existingProducers);
          for (const prod of data.existingProducers) {
            await this.subscribeToPeer(roomId, peerId, prod.peerId, prod.label);
          }
        }
        break;

      case 'routerRtpCapabilities':
        console.log('🔧 Setting up device with RTP capabilities');
        this.state.device = new mediasoupClient.Device();
        await this.state.device.load({ routerRtpCapabilities: data });
        break;

      case 'newProducer':
        console.log('🆕 New producer available:', data);
        await this.subscribeToPeer(roomId, peerId, data.peerId, data.label);
        break;

      case 'consumed':
        await this.handleConsumed(data, roomId, peerId);
        break;

      case 'resumed':
        console.log('▶️ Consumer resumed');
        break;

      case 'producerClosed':
        await this.handleProducerClosed(data);
        break;
    }
  }

  private async handleConsumed(data: any, roomId: string, peerId: string): Promise<void> {
    console.log('🎬 Consuming media:', data);
    
    if (!this.state.recvTransport) {
      console.error('❌ recvTransport not ready');
      return;
    }

    try {
      const consumer = await this.state.recvTransport.consume({
        id: data.id,
        producerId: data.producerId,
        kind: data.kind,
        rtpParameters: data.rtpParameters,
      });

      this.state.consumers.set(consumer.id, consumer);
      
      // Get or create peer streams object
      let peerStreams = this.state.peerStreams.get(data.remotePeerId);
      if (!peerStreams) {
        peerStreams = {};
        this.state.peerStreams.set(data.remotePeerId, peerStreams);
      }

      // Create or update the appropriate stream based on label
      const streamKey = data.label as keyof PeerStreams;
      if (!peerStreams[streamKey]) {
        peerStreams[streamKey] = new MediaStream();
      }

      peerStreams[streamKey]!.addTrack(consumer.track);
      console.log(`📺 Added ${data.label} track for peer ${data.remotePeerId}`);

      // Resume the consumer
      this.send('resume', { roomId, peerId, consumerId: consumer.id });

      // Notify the callback
      if (this.onTrackCallback) {
        this.onTrackCallback({
          stream: peerStreams[streamKey]!,
          label: data.label,
          peerId: data.remotePeerId,
        });
      }
    } catch (error) {
      console.error('❌ Failed to consume:', error);
    }
  }

  private async handleProducerClosed(data: any): Promise<void> {
    console.log('🛑 Producer closed:', data);
    
    // Find and close the corresponding consumer
    for (const [consumerId, consumer] of this.state.consumers) {
      if (consumer.producerId === data.producerId) {
        consumer.close();
        this.state.consumers.delete(consumerId);
        
        // Remove track from stream
        const peerStreams = this.state.peerStreams.get(data.peerId);
        if (peerStreams) {
          const streamKey = data.label as keyof PeerStreams;
          const stream = peerStreams[streamKey];
          if (stream) {
            consumer.track.stop();
            stream.removeTrack(consumer.track);
            
            // If stream is empty, remove it
            if (stream.getTracks().length === 0) {
              delete peerStreams[streamKey];
            }
          }
        }
        break;
      }
    }
  }

  private async subscribeToPeer(roomId: string, peerId: string, remotePeerId: string, label: string): Promise<void> {
    console.log(`🔗 Subscribing to ${label} from ${remotePeerId}`);
    
    if (!this.state.recvTransport) {
      console.log('🔧 Creating receive transport...');
      await this.createTransport(roomId, peerId, false);
    }

    this.send('consume', {
      roomId,
      peerId,
      transportId: this.state.recvTransport!.id,
      remotePeerId,
      rtpCapabilities: this.state.device!.rtpCapabilities,
      label,
    });
  }

  private send(type: string, data: any, expectResponseType?: string): Promise<any> | void {
    if (!this.state.socket || this.state.socket.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket not connected');
      return;
    }

    const message = JSON.stringify({ type, data });
    console.log('📤 Sending:', type, data);
    this.state.socket.send(message);
    
    if (expectResponseType) {
      return new Promise((resolve) => {
        this.pendingRequests.set(expectResponseType, resolve);
      });
    }
  }

  private async createTransport(roomId: string, peerId: string, isSend: boolean): Promise<void> {
    console.log(`🚛 Creating ${isSend ? 'send' : 'receive'} transport...`);
    
    const data = await this.send('createWebRtcTransport', { roomId, peerId }, 'createdTransport') as any;
    console.log('✅ Transport created with params:', data);
   
    if (isSend) {
      this.state.sendTransport = this.state.device!.createSendTransport(data);
      
      this.state.sendTransport.on('connect', ({ dtlsParameters }, callback) => {
        console.log('🔗 Send transport connecting...');
        this.send('connectTransport', {
          roomId,
          peerId,
          transportId: this.state.sendTransport!.id,
          dtlsParameters,
        });
        callback();
      });

      this.state.sendTransport.on('produce', async ({ kind, rtpParameters, appData }, callback) => {
        console.log('📤 Producing:', kind, appData);
        const res = await this.send(
          'produce',
          {
            roomId,
            peerId,
            transportId: this.state.sendTransport!.id,
            kind,
            rtpParameters,
            label: appData?.label || 'unknown',
          },
          'produced'
        );
        callback({ id: res.id });
      });

      this.state.sendTransport.on('connectionstatechange', (state) => {
        console.log('📡 Send transport state:', state);
      });
    } else {
      this.state.recvTransport = this.state.device!.createRecvTransport(data);

      this.state.recvTransport.on('connect', ({ dtlsParameters }, callback) => {
        console.log('🔗 Receive transport connecting...');
        this.send('connectTransport', {
          roomId,
          peerId,
          transportId: this.state.recvTransport!.id,
          dtlsParameters,
        });
        callback();
      });

      this.state.recvTransport.on('connectionstatechange', (state) => {
        console.log('📡 Receive transport state:', state);
      });
    }
  }

  async produceTrack(roomId: string, peerId: string, track: MediaStreamTrack, label: string): Promise<mediasoupClient.types.Producer> {
    if (!this.state.sendTransport) {
      console.log('🔧 Creating send transport...');
      await this.createTransport(roomId, peerId, true);
    }

    // Close existing producer with the same label
    const existingProducer = this.state.producers.get(label);
    if (existingProducer && !existingProducer.closed) {
      console.log(`🛑 Closing existing producer for ${label}`);
      existingProducer.close();
      
      // Notify server about producer closure
      this.send('closeProducer', {
        roomId,
        peerId,
        producerId: existingProducer.id,
        label,
      });
    }

    const producer = await this.state.sendTransport!.produce({
      track,
      appData: { label },
    });

    this.state.producers.set(label, producer);
    console.log(`✅ Produced track (${label}):`, producer.id);
    
    return producer;
  }

  async stopProducing(label: string, roomId: string, peerId: string): Promise<void> {
    const producer = this.state.producers.get(label);
    if (producer && !producer.closed) {
      console.log(`🛑 Stopping producer for ${label}`);
      producer.close();
      this.state.producers.delete(label);
      
      // Notify server
      this.send('closeProducer', {
        roomId,
        peerId,
        producerId: producer.id,
        label,
      });
    }
  }

  getPeerStream(peerId: string, label: 'webcam' | 'screen' | 'audio'): MediaStream | null {
    const peerStreams = this.state.peerStreams.get(peerId);
    return peerStreams?.[label] || null;
  }

  private cleanup(): void {
    // Close all producers
    for (const producer of this.state.producers.values()) {
      if (!producer.closed) {
        producer.close();
      }
    }
    this.state.producers.clear();

    // Close all consumers
    for (const consumer of this.state.consumers.values()) {
      if (!consumer.closed) {
        consumer.close();
      }
    }
    this.state.consumers.clear();

    // Close transports
    if (this.state.sendTransport && !this.state.sendTransport.closed) {
      this.state.sendTransport.close();
    }
    if (this.state.recvTransport && !this.state.recvTransport.closed) {
      this.state.recvTransport.close();
    }

    // Clear streams
    this.state.peerStreams.clear();
    this.pendingRequests.clear();
  }

  disconnect(): void {
    if (this.state.socket) {
      this.state.socket.close();
    }
    this.cleanup();
  }
}

export const mediaSoupClient = new MediaSoupClient();