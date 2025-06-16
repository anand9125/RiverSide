import * as mediasoupClient from 'mediasoup-client';

export interface StreamInfo {
  stream: MediaStream;
  label: string;
  peerId: string;
}

export interface PeerStreams {
  webcam?: MediaStream;
  screen?: MediaStream;
  audio?: MediaStream;
}

export type TrackCallback = (streamInfo: StreamInfo) => void;

export interface MediaSoupState {
  socket: WebSocket | null;
  device: mediasoupClient.types.Device | null;
  sendTransport: mediasoupClient.types.Transport | null;
  recvTransport: mediasoupClient.types.Transport | null;
  producers: Map<string, mediasoupClient.types.Producer>;
  consumers: Map<string, mediasoupClient.types.Consumer>;
  peerStreams: Map<string, PeerStreams>;
}